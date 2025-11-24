import { useState, useRef, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import type { VirtuosoHandle } from "react-virtuoso";
import { useMessageStore } from "@/stores/chat/useMessageStore";
import { useMessageUIStore } from "@/stores/chat/useMessageUIStore";
import { useChannelStore } from "@/stores/chat/useChannelStore";
import { useWebSocketStore } from "@/stores/chat/useWebSocketStore";
import { Button } from "@components/ui/button";
import { ArrowDown } from "lucide-react";
import MessageItem from "./MessageItem";

const MessageList = () => {
  const messages = useMessageStore((state) => state.messages);
  const unreadCount = useMessageUIStore((state) => state.unreadCount);
  const resetUnreadCount = useMessageUIStore((state) => state.resetUnreadCount);
  const isAtBottom = useMessageUIStore((state) => state.isAtBottom);
  const setIsAtBottom = useMessageUIStore((state) => state.setIsAtBottom);
  const incrementUnreadCount = useMessageUIStore(
    (state) => state.incrementUnreadCount,
  );
  const connected = useWebSocketStore((state) => state.connected);
  const activeChannel = useChannelStore((state) => state.activeChannel);

  useEffect(() => {
    const isChannelSwitch = prevChannelRef.current !== activeChannel;

    if (messages.length > 0) {
      if (isChannelSwitch || isAtBottom) {
        // Scroll to bottom
      } else {
        incrementUnreadCount();
      }
    }

    prevChannelRef.current = activeChannel; // Update ref
  }, [messages, isAtBottom, activeChannel, incrementUnreadCount]);

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

  const prevChannelRef = useRef(activeChannel);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (messages.length > 0 && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1,
        behavior: "auto",
      });
    }
  }, [messages.length > 0 ? messages[0]?.id : null]); // Trigger when first message loads

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
              reactions={msg.reactions}
              reactionUsers={msg.reactionUsers}
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
