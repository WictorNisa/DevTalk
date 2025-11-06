import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { userStatus } from "@/utils/userStatus";
import { UserMenu } from "@/components/dashboard/left/UserMenu";
import { ProfileDialog } from "@/components/dashboard/left/ProfileDialog";
import { SettingsDialog } from "@/components/dashboard/left/SettingsDialog";

export type User = {
  id?: string | null;
  username: string;
  avatar?: string;
  status?: string;
  badge?: string | boolean;
};

type Props = {
  user: User;
  collapsed?: boolean;
};

export const UserCard = ({ user, collapsed = false }: Props) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const statusBg = userStatus(user.status);

  if (collapsed) {
    return (
      <div className="flex items-center justify-center p-1">
        <div className="relative">
          <Avatar className="h-7 w-7 rounded-full">
            <AvatarImage
              src={user.avatar || "https://placehold.co/120"}
              alt={user.username}
            />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span
            className={`${statusBg} ring-primary-foreground absolute right-0 bottom-0 h-2 w-2 rounded-full ring-1`}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="w-full items-start rounded-lg p-2">
        <CardContent className="flex items-center gap-3 p-2.5">
          <div className="relative flex-shrink-0">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage
                src={user.avatar || "/images/default-avatar.jpg"}
                alt={user.username}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/default-avatar.jpg";
                }}
              />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className={`${statusBg} ring-primary-foreground absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full ring-1`}
              aria-hidden
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium">
                {user.username}
              </span>
            </div>
            <div className="text-muted-foreground truncate text-xs">
              {user.status === "online"
                ? "Active now"
                : (user.status ?? "Offline")}
            </div>
          </div>

          <div className="flex-shrink-0">
            <UserMenu
              onSignOut={() => {
                /* TODO: sign out logic */
              }}
              onOpenProfile={() => setProfileOpen(true)}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </div>
        </CardContent>
      </Card>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};
