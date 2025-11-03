// import { mockMessages } from "@/data/mockMessages";
import CenterBottomWidget from "./CenterBottomWidget";
import CenterTopWidget from "./CenterTopWidget";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";

const CenterDashPanel = () => {
  const connect = useChatStore((state) => state.connect);
  const disconnect = useChatStore((state) => state.disconnect);
  const connected = useChatStore((state) => state.connected);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <div className="flex h-full w-3/5 flex-1 flex-col gap-2">
      <div className="text-sm">
        {connected ? "🟢 Connected" : "🔴 Disconnected"}
      </div>
      <CenterTopWidget />
      <CenterBottomWidget />
    </div>
  );
};

export default CenterDashPanel;
