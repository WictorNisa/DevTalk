import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { MessageDtoProps } from "@/types/chat/MessageDtoProps";
import type { ChatStateProps } from "@/types/chat/ChatStateProps";
import { useAuthStore } from "../useAuthStore";

import {
  transformBackendMessage,
  ensureConnected,
  // handleIncomingMessage,
  requestHistory,
  subscribeToChannel,
} from "./chatStoreHelpers";

export const useChatStore = create<ChatStateProps>((set, get) => ({
  activeChannel: null,
  messages: [],
  stompClient: null,
  connected: false,
  isAtBottom: true,
  unreadCount: 0,
  currentSubscription: null,

  switchChannel: (channelId: string) => {
    const { stompClient, activeChannel, connected, currentSubscription } =
      get();

    if (!ensureConnected(stompClient, connected)) return;

    // Don't switch if already on this channel
    if (activeChannel === channelId) {
      console.log(`Already on channel ${channelId}`);
      return;
    }

    // Unsubscribe from old channel
    if (currentSubscription) {
      console.log(`Unsubscribing from channel ${activeChannel}`);
      currentSubscription.unsubscribe();
    }

    // Clear messages and update active channel
    set({ messages: [], activeChannel: channelId, unreadCount: 0 });
    console.log(`Switching to channel ${channelId}`);

    // Subscribe to new channel
    const newSubscription = subscribeToChannel(stompClient!, channelId, get, set);
    set({ currentSubscription: newSubscription });

    // Request message history
    requestHistory(stompClient!, channelId);
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
    console.log("Attempting to connect to websocket...");

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

      const channelId = "1";

      // Subscribe to message history
      client.subscribe("/user/queue/history", (message) => {
        try {
          const history = JSON.parse(message.body);
          const transformedMessages = history.map((msg: MessageDtoProps) =>
            transformBackendMessage(msg),
          );
          set({ messages: transformedMessages });

          if (transformedMessages.length > 0) {
            console.log(
              "🔍 First transformed message:",
              transformedMessages[0],
            );
          }
        } catch (error) {
          console.error("Error parsing history", error);
        }
      });

      // Subscribe to channel messages
      const initialSubscription = subscribeToChannel(client, channelId, get, set);
      set({
        activeChannel: channelId,
        currentSubscription: initialSubscription,
      });

      // Request message history
      requestHistory(client, channelId);
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame);
      set({ connected: false });
    };

    client.activate();
    set({ stompClient: client });
  },

  disconnect: () => {
    const { stompClient, currentSubscription } = get();

    if (currentSubscription) {
      currentSubscription.unsubscribe();
    }

    if (stompClient) {
      console.log("🔌 Disconnecting from WebSocket...");
      stompClient.deactivate();
      set({ stompClient: null, connected: false, currentSubscription: null });
    }
  },

  setActiveChannel: (channel) => set({ activeChannel: channel, messages: [] }),

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  clearMessages: () => set({ messages: [] }),

  sendMessage: (channelId: string, content: string) => {
    const { stompClient, connected } = get();

    if (!ensureConnected(stompClient, connected)) return;

    const user = useAuthStore.getState().user;

    if (!user) {
      console.error("Cannot send message: User not authenticated");
      return;
    }

    const userId = parseInt(user.id);
    if (isNaN(userId)) {
      console.error("Cannot send message: Invalid user ID");
      return;
    }

    const messagePayload = {
      content: content,
      userId: userId,
      channelId: parseInt(channelId),
      threadId: null,
      parentMessageId: null,
      destination: `/topic/room/${channelId}`,
    };

    stompClient!.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(messagePayload),
      headers: { "content-type": "application/json" },
    });
  },

  loadMessages: async (channelId: string) => {
    const { stompClient, connected } = get();

    if (!ensureConnected(stompClient, connected)) return;

    console.log("📜 Requesting message history for channel:", channelId);
    requestHistory(stompClient!, channelId);
  },
}));
