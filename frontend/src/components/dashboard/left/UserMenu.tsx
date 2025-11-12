import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, Ellipsis, UserPen } from "lucide-react";

type UserMenuProps = {
  onSignOut?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  children: React.ReactNode; // Avatar component
};

export const UserMenu = ({
  onSignOut,
  onOpenProfile,
  onOpenSettings,
  children,
}: UserMenuProps) => {
  return (
    <div className="group relative">
      {/* Avatar */}
      {children}

      {/* Menu Button - appears on hover over avatar */}
      <DropdownMenu>
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

        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="w-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* TODO: Fetch and display user profile data from backend */}
          {/* GET /api/users/me/profile */}
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              onOpenProfile?.();
            }}
          >
            <UserPen className="mr-3 h-4 w-4" /> Profile
          </DropdownMenuItem>

          {/* TODO: Load user settings from backend */}
          {/* GET /api/users/me/settings */}
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              onOpenSettings?.();
            }}
          >
            <Settings className="mr-3 h-4 w-4" /> Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* TODO: Implement sign out logic with backend
              1. POST /api/auth/logout to invalidate session
              2. Clear local storage/cookies (auth token, refresh token)
              3. Reset auth store/context state
              4. Disconnect WebSocket connections
              5. Clear any cached user data
              6. Redirect to login page
          */}
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              onSignOut?.();
            }}
          >
            <LogOut className="mr-3 h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
