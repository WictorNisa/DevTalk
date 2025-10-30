// STOMP over SockJS end-to-end test against Spring backend on http://localhost:8080

const { Client } = require('@stomp/stompjs');
const SockJS = require('sockjs-client/dist/sockjs');
const WebSocket = require('ws'); // required by sockjs-client in Node

// CONFIG
const WS_URL = process.env.WS_URL || 'http://localhost:8080/ws';
const channelId = Number(process.env.CHANNEL_ID || 1);
const userId = Number(process.env.USER_ID || 1);

// UTILS
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString(), ...a);

// CLIENT
const client = new Client({
  webSocketFactory: () => new SockJS(WS_URL, null, { transports: ['websocket', 'xhr-streaming', 'xhr-polling'] }),
  reconnectDelay: 0,
  debug: (str) => log('[stomp]', str),
  onConnect: async () => {
    log('CONNECTED');

    // Subscriptions
    client.subscribe(`/topic/room/${channelId}`, (msg) => {
      log('[topic]', msg.body);
      lastTopicBodies.push(msg.body);
    });

    client.subscribe(`/user/queue/acks`, (msg) => {
      log('[acks]', msg.body);
    });

    client.subscribe(`/user/queue/history`, (msg) => {
      log('[history]', msg.body);
    });

    client.subscribe(`/user/queue/errors`, (msg) => {
      log('[errors]', msg.body);
    });

    try {
      // 1) Request latest history
      client.publish({
        destination: '/app/message.history',
        body: JSON.stringify({ userId, channelId, beforeTimestamp: null }),
      });
      await delay(500);

      // 2) Send a message
      client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({
          userId,
          channelId,
          content: 'Hello from test script',
          destination: `/topic/room/${channelId}`,
        }),
      });
      await delay(500);

      // 3) Typing on/off
      client.publish({ destination: '/app/typing.start', body: JSON.stringify({ userId, channelId, typing: true }) });
      await delay(300);
      client.publish({ destination: '/app/typing.stop', body: JSON.stringify({ userId, channelId, typing: false }) });
      await delay(300);

      // 4) Read receipt (replace messageId after observed)
      const recentMessageId = await waitForLastMessageId(2000);
      if (!recentMessageId) throw new Error('No messageId observed on topic');

      client.publish({
        destination: '/app/message.read',
        body: JSON.stringify({ userId, channelId, messageId: recentMessageId }),
      });
      await delay(300);

      // 5) Edit message
      client.publish({
        destination: '/app/chat.edit',
        body: JSON.stringify({ userId, channelId, messageId: recentMessageId, content: 'Edited content ✏️' }),
      });
      await delay(500);

      // 6) React / unreact
      client.publish({
        destination: '/app/message.react',
        body: JSON.stringify({ userId, channelId, messageId: recentMessageId, reactionType: 'LIKE' }),
      });
      await delay(300);
      client.publish({
        destination: '/app/message.unreact',
        body: JSON.stringify({ userId, channelId, messageId: recentMessageId, reactionType: 'LIKE' }),
      });
      await delay(300);

      // 7) Attach file (dummy URL)
      client.publish({
        destination: '/app/message.attach',
        body: JSON.stringify({
          userId,
          channelId,
          messageId: recentMessageId,
          type: 'IMAGE',
          url: 'https://example.com/dummy.png',
          filename: 'dummy.png',
          sizeBytes: 12345,
        }),
      });
      await delay(500);

      // 8) Delete message
      client.publish({
        destination: '/app/chat.delete',
        body: JSON.stringify({ userId, channelId, messageId: recentMessageId }),
      });
      await delay(500);

      log('DONE. Check logs above for [topic], [acks], [history], [errors].');
      client.deactivate();
    } catch (e) {
      log('TEST FAILED:', e.message);
      client.deactivate();
    }
  },
  onStompError: (frame) => {
    log('BROKER ERROR', frame.headers['message'], frame.body);
  },
  onWebSocketError: (evt) => {
    log('WS ERROR', evt?.message || evt);
  },
  onWebSocketClose: (evt) => {
    log('WS CLOSE', evt?.code, evt?.reason || '');
  }
});

let lastTopicBodies = [];
function waitForLastMessageId(timeoutMs = 1500) {
  return new Promise((resolve) => {
    const started = Date.now();
    const t = setInterval(() => {
      const id = extractIdFromTopic();
      if (id) {
        clearInterval(t);
        resolve(id);
      }
      if (Date.now() - started > timeoutMs) {
        clearInterval(t);
        resolve(null);
      }
    }, 150);
  });
}

function extractIdFromTopic() {
  for (let i = lastTopicBodies.length - 1; i >= 0; i--) {
    try {
      const obj = JSON.parse(lastTopicBodies[i]);
      if (obj && (obj.id || obj.messageId)) {
        return obj.id || obj.messageId;
      }
    } catch (_) {}
  }
  return null;
}

log('ACTIVATING... to', WS_URL, 'channel', channelId, 'user', userId);
client.activate();

// Fail fast if not connected in time
setTimeout(() => {
  if (!client.connected) {
    log('TIMEOUT: Not connected. Ensure backend is running at', WS_URL, 'and SockJS endpoint is correct.');
    client.deactivate();
  }
}, 5000);
