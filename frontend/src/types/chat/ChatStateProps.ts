import type { MessageDtoProps } from "./MessageDtoProps";
import type { Client } from "@stomp/stompjs";

export interface ChatStateProps {
  messages: MessageDtoProps[];
  connected: boolean;
  stompClient: Client | null;
  activeChannel: string | null;
  isAtBottom: boolean;
  unreadCount: number;
  currentSubscription: any | null;
  setIsAtBottom: (atBottom: boolean) => void;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (channelId: string, content: string) => void;
  addMessage: (message: MessageDtoProps) => void;
  setMessages: (messages: MessageDtoProps[]) => void;
  clearMessages: () => void;
  setActiveChannel: (channel: string) => void;
  loadMessages: (channelId: string) => Promise<void>;
  switchChannel: (channelId: string) => void;
}
