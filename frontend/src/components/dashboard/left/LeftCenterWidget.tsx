import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChannelList, type Channel } from "./ChannelList";

/*
 TODO (LeftCenterWidget)
 - Replace local channels with backend API / realtime channels list.
 - Wire channel selection to router / chat context and load messages.
*/

const defaultChannels: Channel[] = [
  { id: "general", name: "General", topic: "", unread: 2 },
  {
    id: "frontend",
    name: "Frontend",
    topic: "",
    unread: 8,
  },
  { id: "backend", name: "Backend", topic: "", unread: 1 },
];

const LeftCenterWidget = ({ collapsed = false }: { collapsed?: boolean }) => {
  const [channels] = useState<Channel[]>(defaultChannels);
  const [activeId, setActiveId] = useState<string>(channels[0].id);

  const handleSelect = (c: Channel) => {
    setActiveId(c.id);
    // TODO: publish selection to chat context / router / load messages
  };

  return (
    <Card className="h-full w-full rounded-lg">
      <CardContent className="p-2">
        <div className="mb-4 flex w-full items-center justify-center">
          <span className="font-regular text-sm">Channel List</span>
        </div>

        <ChannelList
          channels={channels}
          collapsed={collapsed}
          activeId={activeId}
          onSelect={handleSelect}
        />
      </CardContent>
    </Card>
  );
};

export default LeftCenterWidget;
