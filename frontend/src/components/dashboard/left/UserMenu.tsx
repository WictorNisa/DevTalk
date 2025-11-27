import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, Ellipsis } from "lucide-react";
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
      <LogOut className="mr-3 h-4 w-4" /> {t("userMenu.signOut")}
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
      <Settings className="mr-3 h-4 w-4" /> {t("userMenu.settings")}
    </DropdownMenuItem>
  );
};

const PRESENCE_OPTIONS = [
  { label: "Online", value: "online", color: "bg-green-400" },
  { label: "Idle", value: "idle", color: "bg-yellow-400" },
  { label: "Busy", value: "busy", color: "bg-red-400" },
  { label: "Offline", value: "offline", color: "bg-zinc-400" },
];

type PresenceStatusProps = {
  onSelectPresence?: (status: string) => void;
};

const PresenceStatus = ({ onSelectPresence }: PresenceStatusProps) => {
  return (
    <>
      {PRESENCE_OPTIONS.map((opt) => (
        <DropdownMenuItem
          key={opt.value}
          className="flex cursor-pointer items-center gap-2"
          onSelect={() => onSelectPresence?.(opt.value)}
        >
          <span className={`h-2 w-2 rounded-2xl ${opt.color}`} /> {opt.label}
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
