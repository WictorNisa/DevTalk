import { useState, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import type { VirtuosoHandle } from "react-virtuoso";
import { useChatStore } from "../../../../stores/useChatStore";
import { Button } from "../../../ui/button";
import { ArrowDown } from "lucide-react";
import MessageItem from "./MessageItem";
import MessageItemSkeleton from "@/components/ui/custom/MessageItemSkeleton";

const MessageList = () => {
  const messages = useChatStore((state) => state.messages);
  const unreadCount = useChatStore((state) => state.unreadCount);
  const resetUnreadCount = useChatStore((state) => state.resetUnreadCount);
  const setIsAtBottom = useChatStore((state) => state.setIsAtBottom);
  const isLoadingHistory = useChatStore((state) => state.isLoadingHistory);
  const incrementUnreadCount = useChatStore(
    (state) => state.incrementUnreadCount,
  );

  const [showScrollButton, setShowScrollButton] = useState(false);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const scrollToBottom = () => {
    virtuosoRef.current?.scrollToIndex({
      index: messages.length - 1,
      behavior: "smooth",
    });
    resetUnreadCount();
  };

  const handleAtBottomStateChange = (atBottom: boolean) => {
    setShowScrollButton(!atBottom);
    setIsAtBottom(atBottom);

    if (atBottom) {
      resetUnreadCount();
    }
  };

  return (
    <div className="relative h-full w-full">
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 transform shadow-lg"
          size="sm"
          variant="default"
        >
          <ArrowDown className="mr-2 h-4 w-4" />
          {unreadCount > 0 ? (
            <span>
              {unreadCount} new message{unreadCount > 1 ? "s" : ""}
            </span>
          ) : (
            <span>Scroll to bottom</span>
          )}
        </Button>
      )}

      {isLoadingHistory ? (
        <div className="flex h-full flex-col justify-end px-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <MessageItemSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : (
        <Virtuoso
          ref={virtuosoRef}
          data={messages}
          followOutput="smooth"
          atBottomStateChange={handleAtBottomStateChange}
          atBottomThreshold={50}
          itemContent={(index, msg) => (
            <div className="px-4 py-1">
              <MessageItem
                key={msg.id || index}
                mockMessageId={msg.id}
                mockMessageAvatar={msg.avatar}
                mockMessageUser={msg.user}
                mockMessageText={msg.text}
                mockMessageTimeStamp={msg.timestamp}
              />
            </div>
          )}
          components={{
            // Optional: Custom loading indicator for infinite scroll
            Footer: () => <div className="h-4" />, // Spacer at bottom
          }}
        />
      )}
    </div>
  );
};

export default MessageList;
