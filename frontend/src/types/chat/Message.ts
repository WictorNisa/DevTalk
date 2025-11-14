export interface Message {
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
  attachments?: string[];
  reactions?: Record<string, number>;
  reactionUsers?: Record<string, number[]>;
  replyCount: number;
  mentionedUserIds?: number[];
}
