import { mockMessages } from "@/data/mockMessages";
import CenterBottomWidget from "./CenterBottomWidget";
import CenterTopWidget from "./CenterTopWidget";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";

const CenterDashPanel = () => {
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);

  useEffect(() => {
    if (messages.length === 0) {
      messages.forEach((msg) => addMessage(msg));
    }
  }, [messages.length, addMessage]);

  return (
    <div className="flex h-full w-3/5 flex-1 flex-col gap-2">
      <CenterTopWidget />
      <CenterBottomWidget />
    </div>
  );
};

export default CenterDashPanel;
