import { create } from "zustand";
import type { Message } from "@/types/chat/Message";

interface MessageState {
    messages: Message[];

    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    updateMessage: (messageId: string, updates: Partial<Message>) => void;
    clearMessages: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
    messages: [],

    setMessages: (messages) => set({ messages }),

    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

    updateMessage: (messageId, updates) =>
        set((state) => ({
            messages: state.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg,
            ),
        })),

    clearMessages: () => set({ messages: [] }),
}));
