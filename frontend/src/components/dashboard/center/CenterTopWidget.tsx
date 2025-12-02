import { Card } from "@/components/ui/card";
import MessageList from "./MessageList/MessageList";
import { MsgSearch } from "./MsgSearch";

const CenterTopWidget = () => {
  return (
    <Card className="bg-background relative flex h-full w-full flex-col overflow-hidden rounded-lg">
      {/* Search is placeholder for now, Future implementation. */}
      <MsgSearch />
      <MessageList />
    </Card>
  );
};

export default CenterTopWidget;
