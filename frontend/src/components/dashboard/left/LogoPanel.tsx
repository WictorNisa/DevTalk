import DevTalkLogo from "@assets/img/devtalk-logo.svg?react";
import { Card } from "@/components/ui/card";

const LogoPanel = () => {
  return (
    <Card>
      <div className="flex h-1/12 w-full flex-col rounded-lg border bg-[var(--surface-md-dark)] p-1">
        <div className="flex h-full items-center justify-center bg-[var(--surface-dark)] text-white opacity-90">
          <DevTalkLogo className="h-full" />
          <h1 className="px-1 pt-2 font-['Fira_Mono'] text-2xl">DEVTALK</h1>
        </div>
      </div>
    </Card>
  );
};

export default LogoPanel;
