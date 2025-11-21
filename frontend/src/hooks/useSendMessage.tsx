import { useChannelStore } from "@/stores/chat/useChannelStore";
import { messageService } from "@/services/messageService";

export const useSendMessage = () => {
  const activeChannel = useChannelStore((state) => state.activeChannel);

  const handleSendMessage = (content: string) => {
    if (!activeChannel) {
      console.error(" No active channel selected");
      return;
    }

    if (!content.trim()) {
      console.error(" Cannot send empty message");
      return;
    }

    // Use the WebSocket sendMessage from service
    messageService.sendMessage(activeChannel, content.trim());
  };

  return { sendMessage: handleSendMessage };
};
