import { create } from "zustand";

interface MessageUIState {
    editingMessageId: string | null;
    isAtBottom: boolean;
    unreadCount: number;

    setEditingMessage: (messageId: string | null) => void;
    setIsAtBottom: (atBottom: boolean) => void;
    incrementUnreadCount: () => void;
    resetUnreadCount: () => void;
}

export const useMessageUIStore = create<MessageUIState>((set) => ({
    editingMessageId: null,
    isAtBottom: true,
    unreadCount: 0,

    setEditingMessage: (messageId) => set({ editingMessageId: messageId }),

    setIsAtBottom: (atBottom) => {
        set({ isAtBottom: atBottom });
        if (atBottom) {
            set({ unreadCount: 0 });
        }
    },

    incrementUnreadCount: () =>
        set((state) => ({ unreadCount: state.unreadCount + 1 })),

    resetUnreadCount: () => set({ unreadCount: 0 }),
}));
