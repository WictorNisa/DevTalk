import { useChatStore } from "@/stores/useChatStore";

export const useSendMessage = () => {
  const addMessage = useChatStore((state) => state.addMessage);

  const sendMessage = ({
    text,
    user,
    avatar,
  }: {
    text: string;
    user: string;
    avatar: string;
  }) => {
    const newMessage = {
      id: crypto.randomUUID(),
      user: user,
      avatar: avatar,
      text: text,
      timestamp: new Date().toISOString(),
    };
    addMessage(newMessage);
  };
  return { sendMessage };
};
