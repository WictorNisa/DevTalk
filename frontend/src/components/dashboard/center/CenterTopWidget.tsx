// import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import MessageList from "./MessageList/MessageList";
import MessageSearchBar from "./MessageSearchbar";

const CenterTopWidget = () => {
  // const { t } = useTranslation("dashboard");
  return (
    <Card className="bg-background flex h-full w-full flex-col overflow-hidden rounded-lg">
      <div className="flex h-auto w-full items-center justify-end px-8">
        <MessageSearchBar />
      </div>
      <MessageList />
    </Card>
  );
};

export default CenterTopWidget;
