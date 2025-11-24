import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import MessageList from "./MessageList/MessageList";

const CenterTopWidget = () => {
  const { t } = useTranslation("dashboard");
  return (
    <Card className="bg-background flex h-full w-full flex-col overflow-hidden rounded-lg">
      <div>{t("→ till höger ska jag lägga vår search bar. /Nico")}</div>
      <MessageList />
    </Card>
  );
};

export default CenterTopWidget;
