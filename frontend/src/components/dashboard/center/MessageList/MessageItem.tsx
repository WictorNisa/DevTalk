import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { parseMessageContent, isCurrentUserMentioned } from "./messageHelpers";
import { useAuthStore } from "@/stores/useAuthStore";

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
  const formattedTime = new Date(messageTimeStamp).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const parsedContent = parseMessageContent(messageText);

  return (
    <div className="group hover:bg-accent/50 -mx-4 px-4 py-1 transition-colors">
      <div className="flex gap-3">
        <div className="w-10 shrink-0">
          {!isGrouped && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={messageAvatar} alt={messageAvatar} />
              <AvatarFallback>
                {/* {messageUser.slice(0, 2).toUpperCase()} */}
              </AvatarFallback>
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
                return (
                  <span
                    key={index}
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
                    key={index}
                    className="bg-muted my-1 overflow-x-auto rounded p-2"
                  >
                    <code className="text-xs">{part.content}</code>
                  </pre>
                );
              }
              return <span key={index}>{part.content}</span>;
            })}
          </div>

          <div className="invisible absolute top-1 right-4 flex gap-1 group-hover:visible"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
