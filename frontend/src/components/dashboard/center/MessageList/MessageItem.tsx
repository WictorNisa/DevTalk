import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  parseMessageContent,
  isCurrentUserMentioned,
} from "./MessageItem/messageHelpers";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMemo, useState, useEffect, useRef } from "react";
import { CodeBlock } from "./MessageItem/CodeBlock";
import { Mention } from "./MessageItem/Mention";
import { MessageActions } from "./MessageItem/MessageActions";
import { useMessageUIStore } from "@/stores/chat/useMessageUIStore";
import { messageService } from "@/services/messageService";
import { useChannelStore } from "@/stores/chat/useChannelStore";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, ThumbsDown, ThumbsUp, X } from "lucide-react";

interface MessageItemProps {
  messageId: string;
  messageAvatar: string;
  messageUser: string;
  messageText: string;
  messageTimeStamp: number;
  isGrouped: boolean;
  reactions?: Record<string, number>;
  reactionUsers?: Record<string, number[]>;
}

const MessageItem: React.FC<MessageItemProps> = ({
  messageId,
  messageAvatar,
  messageUser,
  messageText,
  messageTimeStamp,
  isGrouped,
  reactions = {},
  reactionUsers = {},
}) => {
  const { user } = useAuthStore();
  const editingMessageId = useMessageUIStore((state) => state.editingMessageId);
  const setEditingMessage = useMessageUIStore(
    (state) => state.setEditingMessage,
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState(messageText);
  const timeoutRef = useRef<number | null>(null);

  const [optimisticReactions, setOptimisticReactions] = useState(reactions);
  const [optimisticReactionUsers, setOptimisticReactionUsers] =
    useState(reactionUsers);

  useEffect(() => {
    setOptimisticReactions(reactions);
    setOptimisticReactionUsers(reactionUsers);
  }, [reactions, reactionUsers]);

  const upvotes = optimisticReactions["UPVOTE"] || 0;
  const downvotes = optimisticReactions["DOWNVOTE"] || 0;

  // Check if current user has already voted (using optimistic state)
  const currentUserId = user ? parseInt(user.id) : null;
  const upvoteUsers = optimisticReactionUsers["UPVOTE"] || [];
  const downvoteUsers = optimisticReactionUsers["DOWNVOTE"] || [];
  const hasUpvoted = useMemo(
    () => (currentUserId ? upvoteUsers.includes(currentUserId) : false),
    [currentUserId, upvoteUsers],
  );
  const hasDownvoted = useMemo(
    () => (currentUserId ? downvoteUsers.includes(currentUserId) : false),
    [currentUserId, downvoteUsers],
  );

  useEffect(() => {
    setEditedContent(messageText);
  }, [messageText]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const formattedTime = new Date(messageTimeStamp).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const parsedContent = useMemo(
    () => parseMessageContent(messageText),
    [messageText],
  );

  const handleCopyCode = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const isOwnMessage = user?.displayName === messageUser;
  const isEditing = editingMessageId === messageId;

  const handleUpvote = () => {
    if (!currentUserId) return;

    let newUpvoteUsers: number[];
    let newUpvoteCount: number;
    let newDownvoteUsers = downvoteUsers;
    let newDownvoteCount = downvotes;

    if (hasUpvoted) {
      newUpvoteUsers = upvoteUsers.filter((id) => id !== currentUserId);
      newUpvoteCount = upvotes - 1;
    } else {
      // Add upvote and remove downvote if exists
      newUpvoteUsers = [...upvoteUsers, currentUserId];
      newUpvoteCount = upvotes + 1;

      if (hasDownvoted) {
        newDownvoteUsers = downvoteUsers.filter((id) => id !== currentUserId);
        newDownvoteCount = downvotes - 1;
      }
    }

    setOptimisticReactions({
      ...optimisticReactions,
      UPVOTE: newUpvoteCount,
      DOWNVOTE: newDownvoteCount,
    });
    setOptimisticReactionUsers({
      ...optimisticReactionUsers,
      UPVOTE: newUpvoteUsers,
      DOWNVOTE: newDownvoteUsers,
    });

    messageService.voteMessage(messageId, "up");
  };

  const handleDownvote = () => {
    if (!currentUserId) return;

    let newDownvoteUsers: number[];
    let newDownvoteCount: number;
    let newUpvoteUsers = upvoteUsers;
    let newUpvoteCount = upvotes;

    if (hasDownvoted) {
      newDownvoteUsers = downvoteUsers.filter((id) => id !== currentUserId);
      newDownvoteCount = downvotes - 1;
    } else {
      // Add downvote and remove upvote if exists
      newDownvoteUsers = [...downvoteUsers, currentUserId];
      newDownvoteCount = downvotes + 1;

      if (hasUpvoted) {
        newUpvoteUsers = upvoteUsers.filter((id) => id !== currentUserId);
        newUpvoteCount = upvotes - 1;
      }
    }

    setOptimisticReactions({
      ...optimisticReactions,
      UPVOTE: newUpvoteCount,
      DOWNVOTE: newDownvoteCount,
    });
    setOptimisticReactionUsers({
      ...optimisticReactionUsers,
      UPVOTE: newUpvoteUsers,
      DOWNVOTE: newDownvoteUsers,
    });

    messageService.voteMessage(messageId, "down");
  };

  const handleSaveEdit = () => {
    const trimmedContent = editedContent.trim();

    if (!trimmedContent) {
      return;
    }

    messageService.editMessage(messageId, trimmedContent);
    setEditingMessage(null);
    // Refresh messages after edit
    timeoutRef.current = setTimeout(() => {
      const { activeChannel } = useChannelStore.getState();
      if (activeChannel) messageService.loadMessages(activeChannel);
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditedContent(messageText);
    setEditingMessage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter allows normal newline behavior
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
  };

  return (
    <div
      className="group hover:bg-accent/50 relative -mx-4 px-4 py-1 transition-colors"
      data-message-id={messageId}
      role="article"
      aria-label={`Message from ${messageUser}`}
    >
      <div className="flex gap-3">
        {/* Avatar Section */}
        <div className="w-10 shrink-0" data-section="avatar">
          {!isGrouped && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={messageAvatar} alt={messageAvatar} />
            </Avatar>
          )}
        </div>

        {/* Message Content */}
        <div className="min-w-0 flex-1" data-section="content">
          {/* Message Header */}
          {!isGrouped && (
            <div
              className="mb-1 flex items-baseline gap-2"
              data-section="header"
            >
              <span className="text-sm font-semibold">{messageUser}</span>
              <time
                className="text-muted-foreground text-xs"
                dateTime={new Date(messageTimeStamp).toISOString()}
              >
                {formattedTime}
              </time>
            </div>
          )}

          {/* Message Body */}
          <div
            className="relative text-sm wrap-break-word whitespace-pre-wrap"
            data-section="body"
          >
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[60px] resize-none text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    className="h-7 gap-1 px-2"
                  >
                    <Check className="h-3 w-3" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="h-7 gap-1 px-2"
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              parsedContent.map((part, index) => {
                if (part.type === "mention") {
                  const isMentioned = isCurrentUserMentioned(
                    part.content,
                    user,
                  );
                  return (
                    <Mention
                      key={`${messageId}-mention-${index}`}
                      content={part.content}
                      isMentioned={isMentioned}
                    />
                  );
                } else if (part.type === "codeblock") {
                  return (
                    <CodeBlock
                      key={`${messageId}-code-${index}`}
                      part={part}
                      index={index}
                      copiedIndex={copiedIndex}
                      onCopy={handleCopyCode}
                    />
                  );
                }
                return (
                  <span key={`${messageId}-text-${index}`}>{part.content}</span>
                );
              })
            )}
          </div>

          {isOwnMessage && !isEditing && (
            <MessageActions messageId={messageId} />
          )}

          {/* Vote buttons */}
          {!isEditing && (
            <div
              className={`mt-1 flex items-center gap-1 transition-opacity ${upvotes > 0 || downvotes > 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={handleUpvote}
                aria-label={hasUpvoted ? "Remove upvote" : "Upvote message"}
                className="h-6 cursor-pointer gap-1 px-2"
              >
                <ThumbsUp
                  className={`h-3.5 w-3.5 ${hasUpvoted ? "text-green-500" : ""}`}
                />
                {upvotes > 0 && (
                  <span
                    className={`text-xs ${hasUpvoted ? "text-green-500" : ""}`}
                  >
                    {upvotes}
                  </span>
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownvote}
                aria-label={
                  hasDownvoted ? "Remove downvote" : "Downvote message"
                }
                className="h-6 cursor-pointer gap-1 px-2"
              >
                <ThumbsDown
                  className={`h-3.5 w-3.5 ${hasDownvoted ? "text-red-500" : ""}`}
                />
                {downvotes > 0 && (
                  <span
                    className={`text-xs ${hasDownvoted ? "text-red-500" : ""}`}
                  >
                    {downvotes}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
