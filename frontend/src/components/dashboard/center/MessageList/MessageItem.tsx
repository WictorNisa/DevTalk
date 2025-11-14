import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  // const formattedDate = new Date(mockMessageTimeStamp).toLocaleDateString();
  const formattedTime = new Date(messageTimeStamp).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });


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

          <p className="text-sm break-words whitespace-pre-wrap">
            {messageText}
          </p>

          <div className="invisible absolute top-1 right-4 flex gap-1 group-hover:visible"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
