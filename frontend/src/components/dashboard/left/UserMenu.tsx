import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigation } from "@/hooks/useNavigate";
import { useAuthStore } from "@/stores/useAuthStore";
import { Settings, LogOut, EllipsisVertical, UserPen } from "lucide-react";

export const UserMenu = ({ onSignOut }: { onSignOut?: () => void }) => {
  const { goToLandingPage } = useNavigation();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="User actions"
          className="focus-visible:ring-primary/60 p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-40"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem
          onSelect={() => {
            /* open profile */
          }}
        >
          <UserPen className="mr-2 h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            /* open settings */
          }}
        >
          <Settings className="mr-2 h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
