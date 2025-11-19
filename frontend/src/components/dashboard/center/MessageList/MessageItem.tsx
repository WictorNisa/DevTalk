import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { parseMessageContent, isCurrentUserMentioned } from "./messageHelpers";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMemo, useState } from "react";
import { CodeBlock } from "./CodeBlock";
import { Mention } from "./Mention";

interface MessageItemProps {
  messageId: string;
  messageAvatar: string;
  messageUser: string;
  messageText: string;
  messageTimeStamp: number;
  isGrouped: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  messageId,
  messageAvatar,
  messageUser,
  messageText,
  messageTimeStamp,
  isGrouped,
}) => {
  const { user } = useAuthStore();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  return (
    <div className="group hover:bg-accent/50 -mx-4 px-4 py-1 transition-colors">
      <div className="flex gap-3">
        <div className="w-10 shrink-0">
          {!isGrouped && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={messageAvatar} alt={messageAvatar} />
            </Avatar>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {!isGrouped && (
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-sm font-semibold">{messageUser}</span>
              <span className="text-muted-foreground text-xs">
                {formattedTime}
              </span>
            </div>
          )}

          <div className="text-sm wrap-break-word whitespace-pre-wrap">
            {parsedContent.map((part, index) => {
              if (part.type === "mention") {
                const isMentioned = isCurrentUserMentioned(part.content, user);

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
            })}
          </div>

          <div className="invisible absolute top-1 right-4 flex gap-1 group-hover:visible"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
