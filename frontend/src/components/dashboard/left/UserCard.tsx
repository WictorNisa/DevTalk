import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { UserMenu } from "@/components/dashboard/left/UserMenu";
import { ProfileDialog } from "@/components/dashboard/left/ProfileDialog";
import { SettingsDialog } from "@/components/dashboard/left/SettingsDialog";

type Props = { collapsed?: boolean };

export const UserCard = ({ collapsed = false }: Props) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user, isLoading } = useAuthStore();

  const initials = (
    user?.displayName?.slice(0, 2) ||
    user?.externalId?.slice(0, 2) ||
    "?"
  ).toUpperCase();

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
                alt={user?.displayName || "User avatar"}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/default-avatar.jpg";
                }}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          )}
          <span
            className="ring-primary-foreground bg-muted-foreground/60 absolute right-0 bottom-0 h-2 w-2 rounded-full ring-1"
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
              // TODO: handle sign out
            }}
            onOpenProfile={() => setProfileOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          >
            <div className="relative flex-shrink-0">
              {isLoading ? (
                <div className="bg-muted h-12 w-12 animate-pulse rounded-full" />
              ) : (
                <Avatar className="h-12 w-12 rounded-full">
                  <AvatarImage
                    src={user?.avatarUrl || undefined}
                    alt={user?.displayName || "User avatar"}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/default-avatar.jpg";
                    }}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              )}
              <span
                className="ring-primary-foreground bg-muted-foreground/60 absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full ring-1"
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
                <div className="text-muted-foreground truncate text-xs">
                  {/* status text goes here when available */}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};
