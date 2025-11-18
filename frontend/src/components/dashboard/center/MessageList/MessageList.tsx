import { useState, useRef, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import type { VirtuosoHandle } from "react-virtuoso";
import { useChatStore } from "@stores/chat/useChatStore";
import { Button } from "@components/ui/button";
import { ArrowDown } from "lucide-react";
import MessageItem from "./MessageItem";

const MessageList = () => {
  const messages = useChatStore((state) => state.messages);
  const unreadCount = useChatStore((state) => state.unreadCount);
  const resetUnreadCount = useChatStore((state) => state.resetUnreadCount);
  const setIsAtBottom = useChatStore((state) => state.setIsAtBottom);
  const switchChannel = useChatStore((state) => state.switchChannel);
  const connected = useChatStore((state) => state.connected);
  const incrementUnreadCount = useChatStore(
    (state) => state.incrementUnreadCount,
  );
  const connect = useChatStore((state) => state.connect);
  const disconnect = useChatStore((state) => state.disconnect);

  // const { user, checkAuth, isLoading } = useAuthStore(); 

  useEffect(() => {
    const isAtBottom = useChatStore.getState().isAtBottom;

    if (messages.length > 0) {
      console.log("New message received. IsAtBottom:", isAtBottom);

      if (isAtBottom) {
        virtuosoRef.current?.scrollToIndex({
          index: messages.length - 1,
          behavior: "smooth",
        });
      } else {
        incrementUnreadCount();
      }
    }
  }, [messages, incrementUnreadCount]);

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

  const shouldGroupMessage = (currentIndex: number): boolean => {
    if (currentIndex === 0) return false;

    const currentMsg = messages[currentIndex];
    const previousMsg = messages[currentIndex - 1];

    const timeDiff =
      new Date(currentMsg.timestamp).getTime() -
      new Date(previousMsg.timestamp).getTime();

    return (
      currentMsg.senderDisplayName === previousMsg.senderDisplayName &&
      timeDiff < 2 * 60 * 1000
    );
  };

  if (!connected) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Connecting to chat...</p>
      </div>
    );
  }

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

      <Virtuoso
        ref={virtuosoRef}
        data={messages}
        followOutput="smooth"
        atBottomStateChange={handleAtBottomStateChange}
        atBottomThreshold={50}
        itemContent={(index, msg) => (
          <div className="px-4 py-1">
            <MessageItem
              key={msg.id}
              messageId={msg.id}
              messageAvatar={msg.senderAvatarUrl}
              messageUser={msg.senderDisplayName}
              messageText={msg.content}
              messageTimeStamp={msg.timestamp}
              isGrouped={shouldGroupMessage(index)}
            />
          </div>
        )}
        components={{
          Footer: () => <div className="h-4" />,
        }}
      />
    </div>
  );
};

export default MessageList;
