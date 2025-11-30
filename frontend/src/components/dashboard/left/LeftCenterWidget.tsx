import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { ChannelList, type Channel } from "./ChannelList";
import { useChannelStore } from "@/stores/chat/useChannelStore";
import { useWebSocketStore } from "@/stores/chat/useWebSocketStore";

// mapping channel names to their translation keys in dashboard.json
const CHANNEL_TRANSLATION_MAP: Record<string, string> = {
  general: "sidebarLeft.general",
  frontend: "sidebarLeft.frontend",
  backend: "sidebarLeft.backend",
};

const createChannelWithTranslation = (
  id: string,
  name: string,
  topic = "",
  unread = 0,
): Channel => {
  return {
    id,
    name,
    topic,
    unread,
    translationKey: CHANNEL_TRANSLATION_MAP[name.toLowerCase()],
  };
};

const LeftCenterWidget = ({ collapsed = false }: { collapsed?: boolean }) => {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common"); // a second hook for loading common translations
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  // get the chat state from zustand stores
  const activeChannelId = useChannelStore((state) => state.activeChannel);
  const unreadByChannel = useChannelStore((state) => state.unreadByChannel);
  const switchChannel = useChannelStore((state) => state.switchChannel);
  const connected = useWebSocketStore((state) => state.connected);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetch("/api/channels");
        if (!response.ok) {
          throw new Error("Failed to fetch channels");
        }
        const data = await response.json();

        //* ⬇ added the interface ChannelResponse to avoid "any" /Nico *//
        interface ChannelResponse {
          id: number;
          name: string;
          topic?: string;
        }

        // transforming backend data using this helper function
        const transformedChannels: Channel[] = data.map((ch: ChannelResponse) =>
          createChannelWithTranslation(
            ch.id.toString(),
            ch.name,
            ch.topic || "",
            0,
          ),
        );

        setChannels(transformedChannels);
        console.log("📡 Loaded channels:", transformedChannels);
      } catch (error) {
        console.error("❌ Failed to fetch channels:", error);

        // fallback channels
        setChannels([
          createChannelWithTranslation("1", "General"),
          createChannelWithTranslation("2", "Frontend"),
          createChannelWithTranslation("3", "Backend"),
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  // handle when user clicks a channel
  const handleSelect = (channel: Channel) => {
    // don't allow channel switching if WebSocket isn't connected
    if (!connected) {
      console.error("Cannot switch channel: Websocket not connected");
      return;
    }
    console.log(`Switching to channel: ${channel.name}`);
    switchChannel(channel.id);
  };

  if (loading) {
    return (
      <Card className="h-full w-full rounded-lg">
        <CardContent className="p-2">
          <div className="mb-4 flex w-full items-center justify-center">
            <span className="font-regular text-sm">
              {tCommon("common.loading")}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // show message if no channels are available
  if (channels.length === 0) {
    return (
      <Card className="h-full w-full rounded-lg">
        <CardContent className="p-2">
          <div className="mb-4 flex w-full items-center justify-center">
            <span className="font-regular text-sm">
              {t("sidebarLeft.noChannels")}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render the channel list once loaded
  return (
    <Card className="h-full w-full rounded-lg">
      <CardContent className="px-2 pt-0">
        <div
          className={`mb-4 flex w-full items-center justify-center ${collapsed ? "hidden" : ""}`}
        >
          <span className="font-regular mb-2 text-sm">
            {t("sidebarLeft.title")}
          </span>
        </div>

        <ChannelList
          channels={channels.map((channel) => ({
            ...channel,
            unread: unreadByChannel[channel.id] || 0,
          }))}
          collapsed={collapsed}
          activeId={activeChannelId || channels[0].id}
          onSelect={handleSelect}
        />
      </CardContent>
    </Card>
  );
};

export default LeftCenterWidget;
