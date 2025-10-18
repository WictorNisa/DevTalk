import DevTalkLogo from "@assets/img/devtalk-logo.svg?react";
import { Card, CardContent } from "@/components/ui/card";

const LogoPanel = () => {
  return (
    <Card className="h-1/12 p-0">
      <CardContent className="flex h-full items-center justify-center">
        <DevTalkLogo className="h-full" />
        <h1 className="px-1 text-3xl">DEVTALK</h1>
      </CardContent>
    </Card>
  );
};

export default LogoPanel;
