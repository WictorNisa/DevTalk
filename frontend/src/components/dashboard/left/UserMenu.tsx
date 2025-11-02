import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, EllipsisVertical, UserPen } from "lucide-react";

export const UserMenu = ({ onSignOut }: { onSignOut?: () => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="User settings"
          className="cursor-pointer"
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto">
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => {
            /* open profile */
          }}
        >
          <UserPen />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => {
            /* open settings */
          }}
        >
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => {
            onSignOut?.();
          }}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
