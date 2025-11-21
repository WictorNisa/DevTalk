import type { StompSubscription } from "@stomp/stompjs";
import { create } from "zustand";
import { useMessageStore } from "./useMessageStore";
import { useMessageUIStore } from "./useMessageUIStore";
import { messageService } from "@/services/messageService";

interface ChannelState {
  activeChannel: string | null;
  currentSubscription: StompSubscription | null;

  setActiveChannel: (channelId: string | null) => void;
  setSubscription: (subscription: StompSubscription | null) => void;
  switchChannel: (channelId: string) => void;
}

export const useChannelStore = create<ChannelState>((set, get) => ({
  activeChannel: null,
  currentSubscription: null,

  setActiveChannel: (channelId) => set({ activeChannel: channelId }),

  setSubscription: (subscription) => set({ currentSubscription: subscription }),

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
    console.log(`Switching to channel ${channelId}`);

    // Subscribe to new channel and load messages
    const newSubscription = messageService.subscribeToChannel(channelId);
    set({ currentSubscription: newSubscription });
    messageService.loadMessages(channelId);
  },
}));
