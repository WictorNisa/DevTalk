import DevTalkLogo from "@assets/img/devtalk-logo.svg?react";
import { Card, CardContent } from "@/components/ui/card";
import { useSidebarStates } from "@stores/useSidebarStates";

const LogoPanel = () => {
  const { isLeftCollapsed } = useSidebarStates();
  return (
    <Card className="h-1/12 p-0">
      <CardContent className="flex h-full items-center justify-center p-0">
        <DevTalkLogo className="h-full w-10" />
        {!isLeftCollapsed && <h1 className="px-1 text-2xl">DEVTALK</h1>}
      </CardContent>
    </Card>
  );
};

export default LogoPanel;
