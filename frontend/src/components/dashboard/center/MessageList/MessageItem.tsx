import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageItemProps {
  mockMessageId: string;
  mockMessageAvatar: string;
  mockMessageUser: string;
  mockMessageText: string;
  mockMessageTimeStamp: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  mockMessageAvatar,
  mockMessageUser,
  mockMessageText,
  mockMessageTimeStamp,
}) => {
  const formattedDate = new Date(mockMessageTimeStamp).toLocaleDateString();
  const formattedTime = new Date(mockMessageTimeStamp).toLocaleTimeString(
    "en-US",
    {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    },
  );
  return (
    <div className="bg-foreground mt-3 flex w-full gap-2 text-black">
      <div className="m-auto h-max w-max shrink-0 ml-2">
        <Avatar>
          <AvatarImage src={mockMessageAvatar} alt={mockMessageUser} className="object-cover"/>
          <AvatarFallback>LB</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex h-max w-full flex-1 flex-col">
        <div className="flex items-baseline gap-2">
          <h1 className="font-semibold">
            {mockMessageUser}{" "}
            <span className="text-muted-foreground text-xs">
              {formattedTime}
            </span>
          </h1>
        </div>

        <p className="w-full">{mockMessageText}</p>
      </div>
    </div>
  );
};

export default MessageItem;
