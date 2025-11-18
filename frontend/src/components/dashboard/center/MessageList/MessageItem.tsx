import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { parseMessageContent, isCurrentUserMentioned } from "./messageHelpers";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

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

          <div className="text-sm break-words whitespace-pre-wrap">
            {parsedContent.map((part, index) => {
              if (part.type === "mention") {
                const isMentioned = isCurrentUserMentioned(part.content, user);

                const handleMentionClick = () => {
                  // TODO: Implement mention click behavior (e.g., open user profile)
                  console.log("Mention clicked:", part.content);
                };

                const handleMentionKeyDown = (e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMentionClick();
                  }
                };

                return (
                  <span
                    key={`${messageId}-mention-${index}`}
                    role="button"
                    tabIndex={0}
                    onClick={handleMentionClick}
                    onKeyDown={handleMentionKeyDown}
                    // Styling for mentions
                    className={`cursor-pointer font-semibold hover:underline ${
                      isMentioned
                        ? "rounded-sm bg-indigo-800/80 p-0.5 px-1.5" // If current user is being mentioned.
                        : "text-indigo-500/95" // Else.
                    }`}
                  >
                    @{part.content}
                  </span>
                );
              } else if (part.type === "codeblock") {
                return (
                  <pre
                    key={`${messageId}-code-${index}`}
                    className="bg-muted relative my-1 overflow-x-auto rounded p-2"
                  >
                    <div className="absolute top-1 right-2 flex items-center gap-2">
                      {part.language && (
                        <span className="text-muted-foreground bg-background rounded px-2 py-0.5 text-xs">
                          {part.language}
                        </span>
                      )}
                      <button
                        onClick={() => handleCopyCode(part.content, index)}
                        className="bg-background hover:bg-accent text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
                        aria-label="Copy code"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      language={part.language || "text"}
                      style={dracula}
                      PreTag="div"
                      customStyle={{
                        fontSize: "12px",
                        margin: 0,
                        padding: 0,
                        background: "transparent",
                      }}
                      codeTagProps={{
                        style: {
                          fontSize: "12px",
                        },
                      }}
                    >
                      {part.content}
                    </SyntaxHighlighter>
                  </pre>
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
