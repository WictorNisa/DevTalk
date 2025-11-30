import type { StompSubscription } from "@stomp/stompjs";
import { create } from "zustand";
import { useMessageStore } from "./useMessageStore";
import { useMessageUIStore } from "./useMessageUIStore";
import { messageService } from "@/services/messageService";

interface ChannelState {
  activeChannel: string | null;
  currentSubscription: StompSubscription | null;
  unreadByChannel: Record<string, number>;

  setActiveChannel: (channelId: string | null) => void;
  setSubscription: (subscription: StompSubscription | null) => void;
  switchChannel: (channelId: string) => void;
  incrementUnread: (channelId: string) => void;
  resetUnread: (channelId: string) => void;
}

export const useChannelStore = create<ChannelState>((set, get) => ({
  activeChannel: null,
  currentSubscription: null,
  unreadByChannel: {},

  setActiveChannel: (channelId) => set({ activeChannel: channelId }),

  setSubscription: (subscription) => set({ currentSubscription: subscription }),

  incrementUnread: (channelId) =>
    set((state) => ({
      unreadByChannel: {
        ...state.unreadByChannel,
        [channelId]: (state.unreadByChannel[channelId] || 0) + 1,
      },
    })),

  resetUnread: (channelId) =>
    set((state) => {
      if (!state.unreadByChannel[channelId]) {
        return state;
      }
      const next = { ...state.unreadByChannel };
      delete next[channelId];
      return { unreadByChannel: next };
    }),

  switchChannel: (channelId) => {
    const { activeChannel, currentSubscription } = get();

    console.log(
      "🔄 switchChannel called. From:",
      activeChannel,
      "To:",
      channelId,
    );

    // Don't switch if already on this channel
    if (activeChannel === channelId) {
      console.log(`Already on channel ${channelId}`);
      return;
    }

    // Unsubscribe from old channel
    if (currentSubscription) {
      console.log(`Unsubscribing from channel ${activeChannel}`);
      currentSubscription.unsubscribe();
      set({ currentSubscription: null });
    }

    // Clear messages and reset UI state
    useMessageStore.getState().clearMessages();
    useMessageUIStore.getState().resetUnreadCount();

    // Update active channel
    set({ activeChannel: channelId });
    get().resetUnread(channelId);
    console.log(`Switching to channel ${channelId}`);

    // Subscribe to new channel and load messages
    const newSubscription = messageService.subscribeToChannel(channelId);
    if (newSubscription) {
      set({ currentSubscription: newSubscription });
      messageService.loadMessages(channelId);
    } else {
      console.error("Failed to subscribe to channel");
    }
  },
}));
