import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { UserMenu } from "@/components/dashboard/left/UserMenu";
import { SettingsDialog } from "@/components/dashboard/left/SettingsDialog";
import { getPresenceIcon } from "@/utils/presenceIcons";
import type { PresenceStatus } from "@/utils/normalizeStatus";

type Props = { collapsed?: boolean };

export const UserCard = ({ collapsed = false }: Props) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user, isLoading, logout, setPresenceStatus } = useAuthStore();

  const initials = (
    user?.displayName?.slice(0, 2) ||
    user?.externalId?.slice(0, 2) ||
    "?"
  ).toUpperCase();

  const presence = user?.presenceStatus ?? "Online";

  useEffect(() => {
    if (user && user.presenceStatus === "Offline") {
      setPresenceStatus("Online");
    }
  }, [user, setPresenceStatus]);

  const handlePresenceChange = async (status: string) => {
    await setPresenceStatus(status as PresenceStatus);
  };

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
            className="absolute right-0 bottom-0 flex items-center justify-center rounded-full"
            aria-hidden="true"
          >
            {getPresenceIcon(presence)}
          </span>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full min-w-0 items-start rounded-lg p-2">
        <CardContent className="flex min-w-0 items-center gap-3 p-1">
          <UserMenu
            user={user ?? undefined}
            onSignOut={() => {
              logout();
            }}
            onOpenSettings={() => setSettingsOpen(true)}
            onSelectPresence={handlePresenceChange}
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
                className="ring-primary-foreground absolute right-0 bottom-0 flex items-center justify-center rounded-full"
                aria-hidden="true"
              >
                {getPresenceIcon(presence)}
              </span>
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
