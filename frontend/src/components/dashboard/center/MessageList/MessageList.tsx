import MessageItem from "./MessageItem";
import { useChatStore } from "@/stores/useChatStore";
import InfiniteScroll from "react-infinite-scroll-component";

const MessageList = () => {
  const messages = useChatStore((state) => state.messages);
  const loadmore = () => {
    console.log("Loading more messages...");
  };
  const hasMore = false;
  return (
    <div
      id="scrollableDiv"
      className="flex w-full flex-col-reverse overflow-auto"
    >
      <InfiniteScroll
        dataLength={messages.length}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
        inverse={true}
        next={loadmore}
        hasMore={hasMore}
      >
        {messages.map((mockMessage) => (
          <MessageItem
            key={mockMessage.id}
            mockMessageId={mockMessage.id}
            mockMessageAvatar={mockMessage.avatar}
            mockMessageUser={mockMessage.user}
            mockMessageText={mockMessage.text}
            mockMessageTimeStamp={mockMessage.timestamp}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default MessageList;
