import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, EllipsisVertical, UserPen } from "lucide-react";

// 1. Update props type to include the new handlers
type UserMenuProps = {
  onSignOut?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
};

// 2. Destructure the new props
export const UserMenu = ({
  onSignOut,
  onOpenProfile,
  onOpenSettings,
}: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="User actions"
          className="cursor-pointer p-2 focus:outline-none"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 3. Call onOpenProfile when Profile is clicked */}
        <DropdownMenuItem
          onSelect={() => {
            onOpenProfile?.();
          }}
        >
          <UserPen className="mr-3 h-4 w-4" /> Profile
        </DropdownMenuItem>

        {/* 4. Call onOpenSettings when Settings is clicked */}
        <DropdownMenuItem
          onSelect={() => {
            onOpenSettings?.();
          }}
        >
          <Settings className="mr-3 h-4 w-4" /> Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            onSignOut?.();
          }}
        >
          <LogOut className="mr-3 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
