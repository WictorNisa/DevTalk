import DevTalkLogo from "@assets/img/devtalk-logo.svg?react";
import { Card, CardContent } from "@/components/ui/card";
import { useSidebarStates } from "@stores/useSidebarStates";
import { ROUTES } from "@/constants/routes";

const LogoPanel = () => {
  const { isLeftCollapsed } = useSidebarStates();
  return (
    <Card className="h-1/12 p-0">
      <CardContent className="flex h-full items-center justify-center p-0">
        <a href={ROUTES.HOME} className="flex items-center justify-center p-2">
          <DevTalkLogo className="h-8 w-8" />
          {!isLeftCollapsed && <h1 className="px-1 text-xl">DevTalk</h1>}
        </a>
      </CardContent>
    </Card>
  );
};

export default LogoPanel;
