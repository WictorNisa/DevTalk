import { Card } from "@/components/ui/card";
import MessageList from "./MessageList/MessageList";

const CenterTopWidget = () => {
  return (
    <Card className="bg-background flex h-full w-full flex-col">
      <MessageList />
    </Card>
  );
};

export default CenterTopWidget;
