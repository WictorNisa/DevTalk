// import { mockMessages } from "@/data/mockMessages";
import CenterBottomWidget from "./CenterBottomWidget";
import CenterTopWidget from "./CenterTopWidget";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";

const CenterDashPanel = () => {
  const connect = useChatStore((state) => state.connect);
  const disconnect = useChatStore((state) => state.disconnect);
  const setActiveChannel = useChatStore((state) => state.setActiveChannel);
  const connected = useChatStore((state) => state.connected);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  //Once the user connects to the app, set default channel

  useEffect(() => {
    if (connected) {
      console.log("Connected!, default channel '1' (General)");
      setActiveChannel("1");
    }
  }, [connected, setActiveChannel]);

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex-1 overflow-hidden">
        <CenterTopWidget />
      </div>
      <div className="flex-shrink-0">
        <CenterBottomWidget />
      </div>
    </div>
  );
};

export default CenterDashPanel;
