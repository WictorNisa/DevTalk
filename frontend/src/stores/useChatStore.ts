import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// Basic chat store exempel
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
  isAtBottom: boolean;
  unreadCount: number;
  isLoadingHistory: boolean;
  setIsLoadingHistory: (loading: boolean) => void
  setIsAtBottom: (atBottom: boolean) => void;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (channelId: string, content: string) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setActiveChannel: (channel: string) => void;
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
  isAtBottom: true,
  unreadCount: 0,
  isLoadingHistory: false,
  setIsLoadingHistory: (loading) => set({ isLoadingHistory: loading }),
  setIsAtBottom: (atBottom) => {
    set({ isAtBottom: atBottom })
    if (atBottom) {
      set({ unreadCount: 0 })
    }
  },
  incrementUnreadCount: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
  resetUnreadCount: () => set({ unreadCount: 0 }),

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
      const userId = 1;

      set({ isLoadingHistory: true })

      client.subscribe('/user/queue/history', (message) => {
        try {
          const history = JSON.parse(message.body)
          const transformedMessages = history.map((msg: BackendMessageDTO) => {
            return transformBackendMessage(msg)
          })

          set({
            messages: transformedMessages,
            isLoadingHistory: false
          })

        } catch (error) {
          console.error('Error parsing history', error)
          set({ isLoadingHistory: false })
        }
      })

      client.subscribe(`/topic/room/${channelId}`, (message) => {
        console.log('Received message: ', message.body);
        try {
          const payload = JSON.parse(message.body)
          console.log('Parsed message:', payload)

          const transformedMessage = transformBackendMessage(payload)

          const { isAtBottom } = get()
          if (!isAtBottom) {
            get().incrementUnreadCount()
          }

          get().addMessage(transformedMessage);
          console.log('Message added to store')
        } catch (error) {
          console.error('Error parsing message', error)
        }
      })
      console.log(`📡 Subscribed to /topic/room/${channelId}`);
      set({ activeChannel: channelId.toString() });

      set({ isLoadingHistory: true })

      client.publish({
        destination: '/app/message.history',
        body: JSON.stringify({ channelId: channelId, userId: userId, beforeTimestamp: null, threadId: null })
      })
    }

    client.onStompError = (frame) => {
      console.error(' STOMP error:', frame)
      set({ connected: false, isLoadingHistory: false })
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
    const { stompClient, connected } = get()
    if (!connected || !stompClient) {
      console.error('Cannot send message: not connected!')
      return
    }

    const messagePayload = {
      content: content,
      userId: 1,
      channelId: parseInt(channelId),
      threadId: null,
      parentMessageId: null,
      destination: `/topic/room/${channelId}`
    };

    stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(messagePayload),
      headers: { 'content-type': 'application/json' }
    });

    console.log("Message sent!");

  },
  loadMessages: async (channelId: string) => {
    const { stompClient, connected } = get()

    if (!connected || !stompClient) {
      console.error('Cannot load messages: not connected')
      return
    }

    const userId = 1;

    console.log('requesting message history for channel');

    set({ isLoadingHistory: true })

    stompClient.publish({
      destination: '/app/message.history',
      body: JSON.stringify({
        channelId: parseInt(channelId),
        userId: userId,
        beforeTimestamp: null,
        threadId: null
      })
    })

  }
}));