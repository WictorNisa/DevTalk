import { mockMessages } from "@/data/mockMessages";
import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// Basic chat store exempel
// TODO: Connecta med WebSocket när backend är redo.
export type Message = {
  id: string;
  avatar: string;
  user: string;
  text: string;
  timestamp: string;
}

type BackendMessageDTO = {
  id: number;
  content: string;
  senderDisplayName: string;
  senderAvatarUrl: string;
  timestamp: number;
  userId: number;
  channelId: number;
}

type ChatState = {
  messages: Message[];
  connected: boolean;
  stompClient: Client | null;
  activeChannel: string | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (channelId: string, content: string) => void;
  addMessage: (message: Message) => void;
  loadMessages: (channelId: string) => Promise<void>;
};


//Helper function to transform backend messages to frontend format 
const transformBackendMessage = (payload: BackendMessageDTO): Message => {
  return {
    id: payload.id?.toString() || crypto.randomUUID(),
    user: payload.senderDisplayName || 'Unknown User',
    avatar: payload.senderAvatarUrl ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload.senderDisplayName}`,
    text: payload.content || '',
    timestamp: new Date(payload.timestamp || Date.now()).toISOString()
  };
};

export const useChatStore = create<ChatState>((set, get) => ({
  activeChannel: null,
  messages: [],
  stompClient: null,
  connected: false,
  connect: () => {
    console.log(' Attempting to connect to websocket...')

    const socket = new SockJS('http://localhost:8080/ws')

    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('[STOMP Debug]', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    })

    client.onConnect = () => {
      console.log(' STOMP connected successfully');
      set({ connected: true })

      const channelId = 1;

      client.subscribe('/user/queue/history', (message) => {
        try {
          const history = JSON.parse(message.body)
          const transformedMessages = history.map((msg: BackendMessageDTO) => {
            transformBackendMessage(msg)
          })

          set({ messages: transformedMessages })
        } catch (error) {
          console.error('Error parsing history', error)
        }
      })





      client.subscribe(`/topic/room/${channelId}`, (message) => {
        console.log('Recieved message: ', message.body);
        try {
          const payload = JSON.parse(message.body)
          console.log('Parsed message:', payload)

          const transformedMessage = transformBackendMessage(payload)

          get().addMessage(transformedMessage);
          console.log('Message added to store')
        } catch (error) {
          console.error('Error parsing message', error)
        }
      })
      console.log(`📡 Subscribed to /topic/room/${channelId}`);
      set({ activeChannel: channelId.toString() });


      client.publish({
        destination: '/app/message.history',
        body: JSON.stringify({ channelId: channelId, userId: 2, beforeTimestamp: null, threadId: null })
      })
    }

    client.onStompError = (frame) => {
      console.error(' STOMP error:', frame)
      set({ connected: false })
    }

    client.activate()

    set({ stompClient: client })
  },
  disconnect: () => {
    const { stompClient } = get()
    if (stompClient) {
      console.log(' Disconnecting from WebSocket...')
      stompClient.deactivate();
      set({ stompClient: null, connected: false })
    }
  },
  setActiveChannel: (channel) => set({ activeChannel: channel, messages: [] }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
  sendMessage: (channelId: string, content: string) => {
    const { stompClient, connected, userId } = get()
    if (!connected || !stompClient) {
      console.error('Cannot send message: not connected!')
      return
    }

    const messagePayload = {
      channelId: parseInt(channelId),
      userId: 2,
      content: content,
      destination: `/topic/room/${channelId}`
    };

    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(messagePayload),
    });
  }
}));