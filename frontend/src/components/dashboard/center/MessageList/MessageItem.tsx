import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageItemProps {
  mockMessageId: string;
  mockMessageAvatar: string;
  mockMessageUser: string;
  mockMessageText: string;
  mockMessageTimeStamp: string;
  isGrouped: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  mockMessageAvatar,
  mockMessageUser,
  mockMessageText,
  mockMessageTimeStamp,
  isGrouped,
}) => {
  // const formattedDate = new Date(mockMessageTimeStamp).toLocaleDateString();
  const formattedTime = new Date(mockMessageTimeStamp).toLocaleTimeString(
    "en-US",
    {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    },
  );
  return (
    <div className="group hover:bg-accent/50 -mx-4 px-4 py-1 transition-colors">
      <div className="flex gap-3">
        <div className="w-10 shrink-0">
          {!isGrouped && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockMessageAvatar} alt={mockMessageUser} />
              <AvatarFallback>
                {mockMessageUser.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {!isGrouped && (
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-sm font-semibold">{mockMessageUser}</span>
              <span className="text-muted-foreground text-xs">
                {formattedTime}
              </span>
            </div>
          )}

          <p className="text-sm break-words whitespace-pre-wrap">
            {mockMessageText}
          </p>

          <div className="invisible absolute top-1 right-4 flex gap-1 group-hover:visible"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
