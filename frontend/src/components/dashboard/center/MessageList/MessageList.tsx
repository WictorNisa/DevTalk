import { mockMessages } from "@/data/mockMessages";
import MessageItem from "./MessageItem";

const MessageList = () => {
  return (
    <div className="flex h-full w-full flex-col items-center">
      {mockMessages.map((mockMessage) => (
        <MessageItem
          key={mockMessage.id}
          mockMessageId={mockMessage.id}
          mockMessageAvatar={mockMessage.avatar}
          mockMessageUser={mockMessage.user}
          mockMessageText={mockMessage.text}
          mockMessageTimeStamp={mockMessage.timestamp}
        />
      ))}
    </div>
  );
};

export default MessageList;
