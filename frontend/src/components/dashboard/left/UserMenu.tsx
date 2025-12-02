import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  LogOut,
  Ellipsis,
  Moon,
  Circle,
  CircleMinus,
} from "lucide-react";
import type { User } from "@/types/User";

type UserMenuProps = {
  user?: User;
  onSignOut?: () => void;
  onOpenSettings?: () => void;
  onSelectPresence?: (status: string) => void;
  children: React.ReactNode;
};

const DropDownTrigger = () => {
  return (
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        aria-label="User actions"
        className="absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center rounded-full border-0 p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-transparent"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="bg-background/40 rounded-full p-1.5 backdrop-blur-sm">
          <Ellipsis strokeWidth={2} className="text-foreground h-5 w-5" />
        </div>
      </Button>
    </DropdownMenuTrigger>
  );
};

const SignoutButton = ({ onSignOut }: { onSignOut?: () => void }) => {
  const { t } = useTranslation();
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onSelect={() => {
        onSignOut?.();
      }}
    >
      <LogOut className="mr-2 h-4 w-4" /> {t("userMenu.signOut")}
    </DropdownMenuItem>
  );
};

const SettingsMenu = ({ onOpenSettings }: { onOpenSettings?: () => void }) => {
  const { t } = useTranslation();
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onSelect={() => {
        onOpenSettings?.();
      }}
    >
      <Settings className="mr-2 h-4 w-4" /> {t("userMenu.settings")}
    </DropdownMenuItem>
  );
};

type PresenceStatusProps = {
  onSelectPresence?: (status: string) => void;
};

const PresenceStatus = ({ onSelectPresence }: PresenceStatusProps) => {
  const { t } = useTranslation();

  const PRESENCE_OPTIONS = [
    {
      label: t("userMenu.online"),
      value: "online",
      icon: <Circle className="h-4 w-4 fill-green-500 stroke-none" />,
    },
    {
      label: t("userMenu.idle"),
      value: "idle",
      icon: <Moon className="h-4 w-4 fill-yellow-500 stroke-none" />,
    },
    {
      label: t("userMenu.busy"),
      value: "busy",
      icon: <CircleMinus className="h-4 w-4 fill-red-500 stroke-none" />,
    },
    {
      label: t("userMenu.offline"),
      value: "offline",
      icon: <Circle className="h-4 w-4 fill-zinc-400 stroke-none" />,
    },
  ];
  return (
    <>
      {PRESENCE_OPTIONS.map((opt) => (
        <DropdownMenuItem
          key={opt.value}
          className="flex cursor-pointer items-center gap-4"
          onSelect={() => onSelectPresence?.(opt.value)}
        >
          {opt.icon} {opt.label}
        </DropdownMenuItem>
      ))}
    </>
  );
};

export const UserMenu = ({
  onSignOut,
  onOpenSettings,
  onSelectPresence,
  children,
}: UserMenuProps) => {
  return (
    <div className="group relative">
      {/* Avatar */}
      {children}
      <DropdownMenu>
        <DropDownTrigger />
        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="w-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Select Presence */}
          <PresenceStatus onSelectPresence={onSelectPresence} />
          <DropdownMenuSeparator />
          {/* Settings */}
          <SettingsMenu onOpenSettings={onOpenSettings} />
          <DropdownMenuSeparator />
          {/* Logout */}
          <SignoutButton onSignOut={onSignOut} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
