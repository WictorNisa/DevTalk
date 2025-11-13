import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import useNotificationSound from "@/hooks/useNotificationSound";

export type Message = {
  id: string;
  content: string;
  userId: number;
  channelId: number;
  senderDisplayName: string;
  senderAvatarUrl: string;
  timestamp: number;
  createdAt?: number;
  editedAt?: number | null;
  isEdited?: boolean;
  threadId?: number | null;
  parentMessageId?: number | null;
  attachments?: any[];
  reactions?: Record<string, number>;
  reactionUsers?: Record<string, number[]>;
  replyCount?: number;
  mentionedUserIds?: number[];
};

type BackendMessageDTO = {
  id: number;
  content: string;
  senderDisplayName: string;
  senderAvatarUrl: string;
  timestamp: number;
  createdAt?: number;
  userId: number;
  channelId: number;
  editedAt?: number | null;
  isEdited?: boolean;
  threadId?: number | null;
  parentMessageId?: number | null;
  attachments?: any[];
  reactions?: Record<string, number>;
  reactionUsers?: Record<string, number[]>;
  replyCount?: number;
  mentionedUserIds?: number[];
};

type ChatState = {
  messages: Message[];
  connected: boolean;
  stompClient: Client | null;
  activeChannel: string | null;
  isAtBottom: boolean;
  unreadCount: number;
  currentSubscription: any | null
  setIsAtBottom: (atBottom: boolean) => void;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (channelId: string, content: string) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  setActiveChannel: (channel: string) => void;
  loadMessages: (channelId: string) => Promise<void>;
  switchChannel: (channelId: string) => void
};

// Helper function to transform backend messages to frontend format
const transformBackendMessage = (payload: BackendMessageDTO): Message => {
  return {
    id: payload.id?.toString() || crypto.randomUUID(),
    content: payload.content || "",
    userId: payload.userId,
    channelId: payload.channelId,
    senderDisplayName: payload.senderDisplayName || "Unknown User",
    senderAvatarUrl:
      payload.senderAvatarUrl ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload.senderDisplayName}`,
    timestamp: payload.timestamp || payload.createdAt || Date.now(),
    createdAt: payload.createdAt,
    editedAt: payload.editedAt,
    isEdited: payload.isEdited,
    threadId: payload.threadId,
    parentMessageId: payload.parentMessageId,
    attachments: payload.attachments || [],
    reactions: payload.reactions,
    reactionUsers: payload.reactionUsers,
    replyCount: payload.replyCount || 0,
    mentionedUserIds: payload.mentionedUserIds,
  };
};

export const useChatStore = create<ChatState>((set, get) => ({
  activeChannel: null,
  messages: [],
  stompClient: null,
  connected: false,
  isAtBottom: true,
  unreadCount: 0,
  currentSubscription: null,

  switchChannel: (channelId: string) => {
    const { stompClient, activeChannel, connected, currentSubscription } = get();

    if (!connected || !stompClient) {
      console.warn("Cannot switch channels: not connected");
      return;
    }

    // Don't switch if already on this channel
    if (activeChannel === channelId) {
      console.log(`Already on channel ${channelId}`);
      return;
    }

    // Unsubscribe from old channel
    if (currentSubscription) {
      console.log(` Unsubscribing from channel ${activeChannel}`);
      currentSubscription.unsubscribe();
    }

    // Clear messages and update active channel
    set({ messages: [], activeChannel: channelId, unreadCount: 0 });

    console.log(`Switching to channel ${channelId}`);

    // Subscribe to new channel
    const newSubscription = stompClient.subscribe(
      `/topic/room/${channelId}`,
      (message) => {
        console.log("Received message in channel", channelId, ":", message.body);
        try {
          const payload = JSON.parse(message.body);
          console.log(" Parsed payload:", payload);
          const transformedMessage = transformBackendMessage(payload);
          console.log(" Transformed message:", transformedMessage);
          const { isAtBottom } = get();
          if (!isAtBottom) {
            get().incrementUnreadCount();
          }

          get().addMessage(transformedMessage);
          console.log(" Message added to store");
        } catch (error) {
          console.error(" Error parsing message", error);
        }
      }
    );

    // Store the new subscription
    set({ currentSubscription: newSubscription });

    console.log(`📡 Subscribed to /topic/room/${channelId}`);

    // Request message history for new channel
    stompClient.publish({
      destination: "/app/message.history",
      body: JSON.stringify({
        channelId: parseInt(channelId),
        userId: 1,
        beforeTimestamp: null,
        threadId: null,
      }),
    });
  },

  setIsAtBottom: (atBottom) => {
    set({ isAtBottom: atBottom });
    if (atBottom) {
      set({ unreadCount: 0 });
    }
  },

  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),

  resetUnreadCount: () => set({ unreadCount: 0 }),

  setMessages: (messages) => set({ messages }),

  connect: () => {
    console.log(" Attempting to connect to websocket...");

    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("[STOMP Debug]", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    client.onConnect = () => {
      console.log("STOMP connected successfully");
      set({ connected: true });

      const channelId = 1;
      const userId = 1;


      client.subscribe("/user/queue/history", (message) => {
        try {
          const history = JSON.parse(message.body);

          if (history.length > 0) {
            console.log("🔍 First message from backend:", history[0]);
            console.log("🔍 Has senderDisplayName?", history[0].senderDisplayName);
            console.log("🔍 Has senderAvatarUrl?", history[0].senderAvatarUrl);
          }
          const transformedMessages = history.map((msg: BackendMessageDTO) => {
            return transformBackendMessage(msg);
          });

          set({ messages: transformedMessages });
          if (transformedMessages.length > 0) {
            console.log("🔍 First transformed message:", transformedMessages[0]);
          }
        } catch (error) {
          console.error("Error parsing history", error);
        }
      });


      const initialSubscription = client.subscribe(
        `/topic/room/${channelId}`,
        (message) => {
          console.log("📨 Received message: ", message.body);
          try {
            const payload = JSON.parse(message.body);
            console.log("📦 Parsed message:", payload);

            const transformedMessage = transformBackendMessage(payload);

            const { isAtBottom } = get();
            if (!isAtBottom) {
              get().incrementUnreadCount();
            }

            get().addMessage(transformedMessage);
            console.log(" Message added to store");
          } catch (error) {
            console.error("Error parsing message", error);
          }
        }
      );

      console.log(`Subscribed to /topic/room/${channelId}`);
      set({
        activeChannel: channelId.toString(),
        currentSubscription: initialSubscription // Store it!
      });

      // Subscribe to channel messages
      // client.subscribe(`/topic/room/${channelId}`, (message) => {
      //   console.log("📨 Received message: ", message.body);
      //   try {
      //     const payload = JSON.parse(message.body);
      //     console.log("📦 Parsed message:", payload);

      //     const transformedMessage = transformBackendMessage(payload);

      //     const { isAtBottom } = get();
      //     if (!isAtBottom) {
      //       get().incrementUnreadCount();
      //     }

      //     get().addMessage(transformedMessage);
      //     console.log("✅ Message added to store");
      //   } catch (error) {
      //     console.error("❌ Error parsing message", error);
      //   }
      // });

      console.log(`📡 Subscribed to /topic/room/${channelId}`);
      set({ activeChannel: channelId.toString() });

      // Request message history
      client.publish({
        destination: "/app/message.history",
        body: JSON.stringify({
          channelId: channelId,
          userId: userId,
          beforeTimestamp: null,
          threadId: null,
        }),
      });
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame);
      set({ connected: false });
    };

    client.activate();

    set({ stompClient: client });
  },

  disconnect: () => {
    const { stompClient } = get();
    if (stompClient) {
      console.log("🔌 Disconnecting from WebSocket...");
      stompClient.deactivate();
      set({ stompClient: null, connected: false });
    }
  },

  setActiveChannel: (channel) => set({ activeChannel: channel, messages: [] }),

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  clearMessages: () => set({ messages: [] }),

  sendMessage: (channelId: string, content: string) => {
    const { stompClient, connected } = get();

    if (!connected || !stompClient) {
      console.error("❌ Cannot send message: not connected!");
      return;
    }

    const messagePayload = {
      content: content,
      userId: 1, // TODO: Get from useAuthStore
      channelId: parseInt(channelId),
      threadId: null,
      parentMessageId: null,
      destination: `/topic/room/${channelId}`,
    };

    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(messagePayload),
      headers: { "content-type": "application/json" },
    });

    console.log("📤 Message sent!");
  },

  loadMessages: async (channelId: string) => {
    const { stompClient, connected } = get();

    if (!connected || !stompClient) {
      console.error("❌ Cannot load messages: not connected");
      return;
    }

    const userId = 1; // TODO: Get from useAuthStore

    console.log("📜 Requesting message history for channel:", channelId);

    stompClient.publish({
      destination: "/app/message.history",
      body: JSON.stringify({
        channelId: parseInt(channelId),
        userId: userId,
        beforeTimestamp: null,
        threadId: null,
      }),
    });
  },
}));