import { useChatStore } from "@/stores/chat/useChatStore";

export const useSendMessage = () => {
  const sendMessage = useChatStore((state) => state.sendMessage);
  const activeChannel = useChatStore((state) => state.activeChannel);

  const handleSendMessage = (content: string) => {
    if (!activeChannel) {
      console.error(" No active channel selected");
      return;
    }

    if (!content.trim()) {
      console.error(" Cannot send empty message");
      return;
    }

    // Use the WebSocket sendMessage from store
    sendMessage(activeChannel, content.trim());
  };

  return { sendMessage: handleSendMessage };
};
