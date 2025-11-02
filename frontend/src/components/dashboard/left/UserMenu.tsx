import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";

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
          <Settings />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={() => {
            /* open profile */
          }}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            /* open settings */
          }}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            onSignOut?.();
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
