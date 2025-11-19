import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/*
 TODO (ChannelList)
 - Replace local channels with backend / realtime channel list.
 - Wire selection to router / chat context and load messages.
 - Add keyboard navigation & ARIA roles.
 - Add unread counts from backend and mark read on open.
*/

export type Channel = {
  id: string;
  name: string;
  topic?: string;
  unread?: number;
  translationKey?: string;
};

type ChannelItemProps = {
  channel: Channel;
  active?: boolean;
  collapsed?: boolean;
  onSelect?: (c: Channel) => void;
};

export const ChannelItem = ({
  channel,
  active,
  collapsed,
  onSelect,
}: ChannelItemProps) => {
  const { t } = useTranslation("dashboard");

  const channelName = channel.translationKey
    ? t(channel.translationKey)
    : channel.name;

  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(channel);
      }}
      aria-pressed={active}
      className={`w-full cursor-pointer justify-between py-2 text-sm ${active ? "font-semibold" : "font-light"} ${collapsed ? "justify-center px-2.5" : "px-2.5"}`}
      title={channel.topic || undefined}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate">{channelName}</span>
      </span>

      {!collapsed && channel.unread ? (
        <Badge variant="destructive" className="h-5 w-5 rounded-full">
          {channel.unread}
        </Badge>
      ) : null}
    </Button>
  );
};

type ChannelListProps = {
  channels: Channel[];
  collapsed?: boolean;
  activeId?: string;
  onSelect?: (c: Channel) => void;
  asCard?: boolean;
};

export const ChannelList = ({
  channels,
  collapsed = false,
  activeId,
  onSelect,
  asCard = false,
}: ChannelListProps) => {
  const nav = (
    <div
      aria-label="Channels"
      className={`flex flex-col gap-1 ${collapsed ? "items-center" : ""}`}
    >
      {channels.map((c) => (
        <ChannelItem
          key={c.id}
          channel={c}
          active={c.id === activeId}
          collapsed={collapsed}
          onSelect={onSelect}
        />
      ))}
    </div>
  );

  if (asCard) {
    return (
      <Card className="rounded-lg">
        <CardContent className="p-2">{nav}</CardContent>
      </Card>
    );
  }

  return nav;
};
