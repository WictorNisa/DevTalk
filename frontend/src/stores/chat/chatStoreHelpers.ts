import type { ChatStateProps } from "@/types/chat/ChatStateProps";
import type { Message } from "@/types/chat/Message";
import type { MessageDtoProps } from "@/types/chat/MessageDtoProps";
import { Client } from "@stomp/stompjs";

// Helper function to transform backend messages to frontend format
export const transformBackendMessage = (payload: MessageDtoProps): Message => {
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

export const ensureConnected = (
  stompClient: Client | null,
  connected: boolean,
) => {
  if (!connected || !stompClient) {
    console.warn("Cannot perform task: Not connected.");
    return false;
  }
  return true;
};

export const handleIncomingMessage = (
  messageBody: string,
  get: () => ChatStateProps,
) => {
  try {
    const payload = JSON.parse(messageBody);
    const transformedMessage = transformBackendMessage(payload);
    const { isAtBottom } = get();

    if (!isAtBottom) {
      get().incrementUnreadCount();
    }

    get().addMessage(transformedMessage);
    return transformedMessage;
  } catch (error) {
    console.error("Error parsing message", error);
    return null;
  }
};

export const requestHistory = (
  stompClient: Client,
  channelId: string,
  userId: number = 1,
) => {
  stompClient.publish({
    destination: "/app/message.history",
    body: JSON.stringify({
      channelId: parseInt(channelId),
      userId,
      beforeTimestamp: null,
      threadId: null,
    }),
  });
};

export const subscribeToChannel = (
  stompClient: Client,
  channelId: string,
  get: () => ChatStateProps,
) => {
  return stompClient.subscribe(`/topic/room/${channelId}`, (message) => {
    console.log(`Received message in channel ${channelId}:`, message.body);
    handleIncomingMessage(message.body, get);
  });
};
