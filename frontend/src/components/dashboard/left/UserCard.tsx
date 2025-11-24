import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { UserMenu } from "@/components/dashboard/left/UserMenu";
import { SettingsDialog } from "@/components/dashboard/left/SettingsDialog";
import { userStatus } from "@/utils/userStatus";

type Props = { collapsed?: boolean };

export const UserCard = ({ collapsed = false }: Props) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user, isLoading, logout } = useAuthStore();

  const initials = (
    user?.displayName?.slice(0, 2) ||
    user?.externalId?.slice(0, 2) ||
    "?"
  ).toUpperCase();

  const presence = user?.presenceStatus ?? "Offline";
  const statusBg = userStatus(presence.toLowerCase());

  if (collapsed) {
    return (
      <Card className="flex items-center justify-center rounded-lg p-2.5">
        <div className="relative">
          {isLoading ? (
            <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
          ) : (
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage
                src={user?.avatarUrl || undefined}
                alt={user?.displayName || "User Avatar"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          )}
          <span
            className={`${statusBg} ring-primary-foreground absolute right-0 bottom-0 h-2 w-2 rounded-full ring-1`}
            aria-hidden="true"
          />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full min-w-0 items-start rounded-lg p-2">
        <CardContent className="flex min-w-0 items-center gap-2.5 p-1">
          <UserMenu
            onSignOut={() => {
              logout();
            }}
            onOpenSettings={() => setSettingsOpen(true)}
          >
            <div className="relative shrink-0">
              {isLoading ? (
                <div className="bg-muted h-12 w-12 animate-pulse rounded-full" />
              ) : (
                <Avatar className="h-12 w-12 rounded-full">
                  <AvatarImage
                    src={user?.avatarUrl || undefined}
                    alt={user?.displayName || "User avatar"}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              )}
              <span
                className={`${statusBg} ring-primary-foreground absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full ring-1`}
                aria-hidden="true"
              />
            </div>
          </UserMenu>

          <div className="min-w-0 flex-1 overflow-hidden">
            {isLoading ? (
              <div className="w-full space-y-2">
                <div className="bg-muted h-3 w-1/3 animate-pulse rounded" />
                <div className="bg-muted h-3 w-1/4 animate-pulse rounded" />
              </div>
            ) : (
              <div>
                <div className="flex min-w-0 items-center gap-2">
                  <span className="block truncate text-sm font-medium">
                    {user?.displayName || user?.externalId || "User"}
                  </span>
                </div>
                {user?.presenceStatus && (
                  <div className="text-muted-foreground truncate text-xs">
                    {presence.charAt(0).toUpperCase() +
                      presence.slice(1).toLowerCase()}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};
