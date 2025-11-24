import { useMessageStore } from "@/stores/chat/useMessageStore";
import { useChannelStore } from "@/stores/chat/useChannelStore";
import { useMessageUIStore } from "@/stores/chat/useMessageUIStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { MessageDtoProps } from "@/types/chat/MessageDtoProps";
import type { Message } from "@/types/chat/Message";
import { Client } from "@stomp/stompjs";
import { useWebSocketStore } from "@/stores/chat/useWebSocketStore";

// Utility functions
const getAuthenticatedUserId = (): number | null => {
  const user = useAuthStore.getState().user;

  if (!user) {
    console.error("User not authenticated");
    return null;
  }

  const userId = parseInt(user.id);
  if (isNaN(userId)) {
    console.error("Invalid user ID");
    return null;
  }

  return userId;
};

const transformBackendMessage = (payload: MessageDtoProps): Message => {
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

const requestHistory = (
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

export const messageService = {
  sendMessage: (channelId: string, content: string) => {
    const { stompClient, isConnected } = useWebSocketStore.getState();

    if (!isConnected() || !stompClient) {
      console.error("Cannot send message: Not connected");
      return;
    }

    const userId = getAuthenticatedUserId();
    if (userId === null) {
      console.error("Cannot send message: User not authenticated");
      return;
    }

    const messagePayload = {
      content,
      userId,
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
  },

  editMessage: (messageId: string, newContent: string) => {
    if (!messageId || messageId.trim() === "") {
      console.error("Cannot edit message: Invalid message ID");
      return;
    }

    const trimmedContent = newContent.trim();
    if (!trimmedContent) {
      console.error("Cannot edit message: Content cannot be empty");
      return;
    }

    const { stompClient, isConnected } = useWebSocketStore.getState();
    const { activeChannel } = useChannelStore.getState();

    if (!isConnected() || !stompClient) {
      console.error("Cannot edit message: Not connected");
      return;
    }

    const userId = getAuthenticatedUserId();
    if (userId === null) {
      console.error("Cannot edit message: User not authenticated");
      return;
    }

    if (!activeChannel) {
      console.error("Cannot edit message: No active channel");
      return;
    }

    stompClient.publish({
      destination: "/app/chat.edit",
      body: JSON.stringify({
        messageId,
        content: trimmedContent,
        channelId: parseInt(activeChannel),
        userId,
      }),
      headers: { "content-type": "application/json" },
    });
  },

  deleteMessage: (messageId: string) => {
    if (!messageId || messageId.trim() === "") {
      console.error("Cannot delete message: Invalid message ID");
      return;
    }

    const { stompClient, isConnected } = useWebSocketStore.getState();
    const { activeChannel } = useChannelStore.getState();

    if (!isConnected() || !stompClient) {
      console.error("Cannot delete message: Not connected");
      return;
    }

    const userId = getAuthenticatedUserId();
    if (userId === null) {
      console.error("Cannot delete message: User not authenticated");
      return;
    }

    if (!activeChannel) {
      console.error("Cannot delete message: No active channel");
      return;
    }

    stompClient.publish({
      destination: "/app/chat.delete",
      body: JSON.stringify({
        messageId,
        channelId: parseInt(activeChannel),
        userId,
      }),
      headers: { "content-type": "application/json" },
    });
  },

  loadMessages: (channelId: string) => {
    const { stompClient, isConnected } = useWebSocketStore.getState();

    if (!isConnected() || !stompClient) {
      console.error("Cannot load messages: Not connected");
      return;
    }

    console.log("📜 Requesting message history for channel:", channelId);
    requestHistory(stompClient, channelId);
  },

  subscribeToChannel: (channelId: string) => {
    const { stompClient, isConnected } = useWebSocketStore.getState();

    if (!isConnected() || !stompClient) {
      console.error("Cannot subscribe: Not connected");
      return null;
    }

    return stompClient.subscribe(`/topic/room/${channelId}`, (message) => {
      console.log(`Received message in channel ${channelId}:`, message.body);

      try {
        const payload = JSON.parse(message.body);
        const transformedMessage = transformBackendMessage(payload);
        const { isAtBottom } = useMessageUIStore.getState();

        if (!isAtBottom) {
          useMessageUIStore.getState().incrementUnreadCount();
        }

        useMessageStore.getState().addMessage(transformedMessage);
      } catch (error) {
        console.error("Error parsing message", error);
      }
    });
  },

  voteMessage: (messageId: string, voteType: "up" | "down") => {
    const { stompClient, isConnected } = useWebSocketStore.getState();
    const { activeChannel } = useChannelStore.getState();

    if (!isConnected() || !stompClient) {
      console.error("Cannot vote: Not connected");
      return;
    }

    const userId = getAuthenticatedUserId();
    if (userId === null) {
      console.error("Cannot vote: User not authenticated");
      return;
    }

    if (!activeChannel) {
      console.error("Cannot vote: No active channel");
      return;
    }

    // Map to their reaction type enum
    const reactionType = voteType === "up" ? "UPVOTE" : "DOWNVOTE";

    const payload = {
      messageId,
      reactionType,
      channelId: parseInt(activeChannel),
      userId,
    };

    console.log("📊 Sending vote:", payload);

    stompClient.publish({
      destination: "/app/chat.react",
      body: JSON.stringify(payload),
      headers: { "content-type": "application/json" },
    });
  },

  setupConnection: () => {
    const { stompClient, isConnected } = useWebSocketStore.getState();

    if (!isConnected() || !stompClient) {
      console.error("Cannot setup: Not connected");
      return;
    }

    //TODO: Fix the channel ID so that it's not a magic number.
    const channelId = "1"; // This is 1/3 channels.

    // Subscribe to message history
    stompClient.subscribe("/user/queue/history", (message) => {
      try {
        const history = JSON.parse(message.body);
        const transformedMessages = history.map((msg: MessageDtoProps) =>
          transformBackendMessage(msg),
        );
        useMessageStore.getState().setMessages(transformedMessages);

        if (transformedMessages.length > 0) {
          console.log("🔍 First transformed message:", transformedMessages[0]);
        }
      } catch (error) {
        console.error("Error parsing history", error);
      }
    });

    // Subscribe to channel and request history
    const subscription = messageService.subscribeToChannel(channelId);
    useChannelStore.getState().setActiveChannel(channelId);
    useChannelStore.getState().setSubscription(subscription);
    messageService.loadMessages(channelId);
  },
};
