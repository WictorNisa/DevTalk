import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { ChannelList, type Channel } from "./ChannelList";
import { useChatStore } from "@/stores/chat/useChatStore";

/*
 TODO (LeftCenterWidget)
 - Replace local channels with backend API / realtime channels list.
 - Wire channel selection to router / chat context and load messages.
*/

const CHANNEL_TRANSLATION_MAP: Record<string, string> = {
  general: "sidebarLeft.general",
  frontend: "sidebarLeft.frontend",
  backend: "sidebarLeft.backend",
};

const LeftCenterWidget = ({ collapsed = false }: { collapsed?: boolean }) => {
  const { t } = useTranslation("dashboard");

  const [channels, setChannels] = useState<Channel[]>([]);

  const [loading, setLoading] = useState(true);

  // Get chat state from Zustand store
  const activeChannelId = useChatStore((state) => state.activeChannel);
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

        //* ⬇ la till interface ChannelResponse för att undvika "any" /Nico *//
        interface ChannelResponse {
          id: number;
          name: string;
          topic?: string;
        }

        const transformedChannels: Channel[] = data.map(
          (ch: ChannelResponse) => ({
            id: ch.id.toString(),
            name: ch.name,
            topic: ch.topic || "",
            unread: 0,
            translationKey: CHANNEL_TRANSLATION_MAP[ch.name.toLowerCase()],
          }),
        );

        setChannels(transformedChannels);
        console.log("📡 Loaded channels:", transformedChannels);
      } catch (error) {
        console.error("❌ Failed to fetch channels:", error);

        // Fallbacks
        setChannels([
          {
            id: "1",
            name: "General",
            topic: "",
            unread: 0,
            translationKey: "sidebarLeft.general",
          },
          {
            id: "2",
            name: "Frontend",
            topic: "",
            unread: 0,
            translationKey: "sidebarLeft.frontend",
          },
          {
            id: "3",
            name: "Backend",
            topic: "",
            unread: 0,
            translationKey: "sidebarLeft.backend",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  // when user clicks a channel
  const handleSelect = (channel: Channel) => {
    // if WebSocket isn't connected = don't allow switching
    if (!connected) {
      console.error("Cannot switch channel: Websocket not connected");
      return;
    }
    console.log(`Switching to channel: ${channel.name}`);
    switchChannel(channel.id);
  };

  // Show loading state while fetching channels
  if (loading) {
    return (
      <Card className="h-full w-full rounded-lg">
        <CardContent className="p-2">
          <div className="mb-4 flex w-full items-center justify-center">
            <span className="font-regular text-sm">
              {t("common:common.loading")}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show message if no channels are available (copilot suggestion)
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

  // render the channel list once loaded
  return (
    <Card className="h-full w-full rounded-lg">
      <CardContent className="p-2">
        <div className="mb-4 flex w-full items-center justify-center">
          <span className="font-regular text-sm">{t("sidebarLeft.title")}</span>
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
