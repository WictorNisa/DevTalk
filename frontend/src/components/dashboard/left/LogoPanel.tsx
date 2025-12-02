import DevTalkLogo from "@assets/img/devtalk-logo.svg?react";
import { Card, CardContent } from "@/components/ui/card";
import { useSidebarStates } from "@stores/useSidebarStates";
import { ROUTES } from "@/constants/routes";
import { NavLink } from "react-router";

const LogoPanel = () => {
  const { isLeftCollapsed } = useSidebarStates();
  return (
    <Card className="h-13 min-w-0 rounded-lg p-0">
      <CardContent className="flex h-full items-center justify-center p-0">
        <NavLink
          to={ROUTES.HOME}
          className="flex items-center justify-center p-2"
        >
          <DevTalkLogo className="h-9 w-9 shrink-0" />
          {!isLeftCollapsed && (
            <h1 className="px-2 text-lg font-medium whitespace-nowrap">
              DevTalk
            </h1>
          )}
        </NavLink>
      </CardContent>
    </Card>
  );
};

export default LogoPanel;
