import { useState } from "react";
import { ChannelList, Channel } from "@/components/dashboard/left/ChannelList";
import MOCK_CHANNELS from "@/data/dummyChannels.json";

export const LeftPanel = () => {
  const [activeChannelId, setActiveChannelId] = useState("general");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleChannelSelect = (channel: Channel) => {
    setActiveChannelId(channel.id);
    console.log("Selected channel:", channel.name);
    // Later: navigate to channel, load messages, etc.
  };

  return (
    <div className="flex h-full flex-col border-r">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Channels</h2>
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto p-2">
        <ChannelList
          channels={MOCK_CHANNELS}
          activeId={activeChannelId}
          onSelect={handleChannelSelect}
          collapsed={isCollapsed}
          asCard={false}
        />
      </div>
    </div>
  );
};