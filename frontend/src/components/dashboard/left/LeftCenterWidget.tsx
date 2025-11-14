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

const LeftCenterWidget = ({ collapsed = false }: { collapsed?: boolean }) => {
  const { t } = useTranslation("dashboard");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
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

        //* ⬇ Vad ska jag lägga för type istället för "any"? Försökte med andra conditions. Any får det att kännas unsafe när TS ska hållas typat så bra man kan? /Nico

        const transformedChannels: Channel[] = data.map((ch: any) => ({
          id: ch.id.toString(),
          name: ch.name,
          topic: ch.topic || "",
          unread: 0,

          translationKey:
            ch.name.toLowerCase() === "general"
              ? "sidebarLeft.general"
              : ch.name.toLowerCase() === "frontend"
                ? "sidebarLeft.frontend"
                : ch.name.toLowerCase() === "backend"
                  ? "sidebarLeft.backend"
                  : undefined,
        }));

        setChannels(transformedChannels);
        console.log("📡 Loaded channels:", transformedChannels);
      } catch (error) {
        console.error("❌ Failed to fetch channels:", error);

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

  const handleSelect = (channel: Channel) => {
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
              {t("sidebarLeft.loading")}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full rounded-lg">
      <CardContent className="p-2">
        <div className="mb-4 flex w-full items-center justify-center">
          <span className="font-regular text-sm">{t("sidebarLeft.title")}</span>
        </div>

        <ChannelList
          channels={channels}
          collapsed={collapsed}
          activeId={activeChannelId || channels[0]?.id}
          onSelect={handleSelect}
        />
      </CardContent>
    </Card>
  );
};

export default LeftCenterWidget;
