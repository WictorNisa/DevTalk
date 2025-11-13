import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChannelList, type Channel } from "./ChannelList";
import { useChatStore } from "@/stores/useChatStore";

/*
 TODO (LeftCenterWidget)
 - Replace local channels with backend API / realtime channels list.
 - Wire channel selection to router / chat context and load messages.
*/

const defaultChannels: Channel[] = [
  { id: "general", name: "General", topic: "", unread: 3 },
  {
    id: "frontend",
    name: "Frontend",
    topic: "",
    unread: 8,
  },
  { id: "backend", name: "Backend", topic: "", unread: 1 },
];

const LeftCenterWidget = ({ collapsed = false }: { collapsed?: boolean }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const activeChannelId = useChatStore((state) => state.activeChannel);
  const setActiveChannel = useChatStore((state) => state.setActiveChannel);
  const switchChannel = useChatStore((state) => state.switchChannel);
  const connected = useChatStore((state) => state.connected);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch("/api/channels");
        if (!response.ok) {
          throw new Error("Failed to fetch channels");
        }
        const data = await response.json();

        const transformedChannels: Channel[] = data.map((ch: any) => ({
          id: ch.id.toString(),
          name: ch.name,
          topic: ch.topic || "",
          unread: 0,
        }));

        setChannels(transformedChannels);
        console.log("📡 Loaded channels:", transformedChannels);
      } catch (error) {
        console.error("❌ Failed to fetch channels:", error);

        setChannels([
          { id: "1", name: "General", topic: "", unread: 0 },
          { id: "2", name: "Frontend", topic: "", unread: 0 },
          { id: "3", name: "Backend", topic: "", unread: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  const handleSelect = (channel: Channel) => {
    if (!connected) {
      console.error("Cannot switch channel: Websocket not connected");
    }

    console.log(`Switching to channel: ${channel} `);
    switchChannel(channel.id);
  };

  if (loading) {
    return (
      <Card className="h-full w-full rounded-lg">
        <CardContent className="p-2">
          <div className="mb-4 flex w-full items-center justify-center">
            <span className="font-regular text-sm">Loading channels...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full rounded-lg">
      <CardContent className="p-2">
        <div className="mb-4 flex w-full items-center justify-center">
          <span className="font-regular text-sm">Channel List</span>
        </div>

        <ChannelList
          channels={channels}
          collapsed={collapsed}
          activeId={activeChannelId || channels[0].id}
          onSelect={handleSelect}
        />
      </CardContent>
    </Card>
  );
};

export default LeftCenterWidget;
