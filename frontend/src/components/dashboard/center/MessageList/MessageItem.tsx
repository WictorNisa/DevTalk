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

  // Extract upvotes and downvotes from reactions
  const upvotes = reactions["UPVOTE"] || 0;
  const downvotes = reactions["DOWNVOTE"] || 0;

  // Check if current user has already voted
  const currentUserId = user ? parseInt(user.id) : null;
  const upvoteUsers = reactionUsers["UPVOTE"] || [];
  const downvoteUsers = reactionUsers["DOWNVOTE"] || [];
  const hasUpvoted = currentUserId
    ? upvoteUsers.includes(currentUserId)
    : false;
  const hasDownvoted = currentUserId
    ? downvoteUsers.includes(currentUserId)
    : false;

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
    messageService.voteMessage(messageId, "up");
  };

  const handleDownvote = () => {
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

          {/* Message Actions (hover menu) - Only show for own messages */}
          {isOwnMessage && !isEditing && (
            <MessageActions messageId={messageId} />
          )}

          {/* Vote buttons - show on hover */}
          {!isEditing && (
            <div className="invisible mt-1 flex items-center gap-1 group-hover:visible">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleUpvote}
                disabled={hasUpvoted}
                className={`h-6 gap-1 px-2 hover:bg-green-500/10 hover:text-green-500 ${hasUpvoted ? "bg-green-500/20 text-green-500" : ""}`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownvote}
                disabled={hasDownvoted}
                className={`h-6 gap-1 px-2 hover:bg-red-500/10 hover:text-red-500 ${hasDownvoted ? "bg-red-500/20 text-red-500" : ""}`}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* Vote counts - show if votes exist */}
          {(upvotes > 0 || downvotes > 0) && (
            <div className="mt-1 flex items-center gap-2">
              {upvotes > 0 && (
                <span className="flex items-center gap-0.5">
                  <ThumbsUp className="h-3.5 w-3.5 text-green-500/70" />
                  <span className="text-xs text-green-500/70">+{upvotes}</span>
                </span>
              )}
              {downvotes > 0 && (
                <span className="flex items-center gap-0.5">
                  <ThumbsDown className="h-3.5 w-3.5 text-red-500/70" />
                  <span className="text-xs text-red-500/70">-{downvotes}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
