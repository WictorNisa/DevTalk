// import { mockMessages } from "@/data/mockMessages";
// import { useTranslation } from "react-i18next";
import CenterBottomWidget from "./CenterBottomWidget";
import CenterTopWidget from "./CenterTopWidget";
import { useWebSocketStore } from "@/stores/chat/useWebSocketStore";
import { messageService } from "@/services/messageService";
import { useEffect } from "react";

const CenterDashPanel = () => {
  const connect = useWebSocketStore((state) => state.connect);
  const disconnect = useWebSocketStore((state) => state.disconnect);
  const connected = useWebSocketStore((state) => state.connected);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Once the user connects to the app, setup message service
  useEffect(() => {
    if (connected) {
      messageService.setupConnection();
    }
  }, [connected]);

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex-1 overflow-hidden">
        <CenterTopWidget />
      </div>
      <div className="shrink-0">
        <CenterBottomWidget />
      </div>
    </div>
  );
};

export default CenterDashPanel;
