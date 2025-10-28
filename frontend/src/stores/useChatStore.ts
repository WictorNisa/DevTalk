import { mockMessages } from "@/data/mockMessages";
import { create } from "zustand";


// Basic chat store exempel
// TODO: Connecta med WebSocket när backend är redo.
export type Message = {
  id: string;
  avatar: string;
  user: string;
  text: string;
  timestamp: string;
};

type ChatState = {
  activeChannel: string | null;
  messages: Message[];
  setActiveChannel: (channel: string) => void;
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  activeChannel: null,
  messages: mockMessages,
  setActiveChannel: (channel) => set({ activeChannel: channel, messages: [] }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
}));
