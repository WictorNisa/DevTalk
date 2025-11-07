import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { userStatus } from "@/utils/userStatus";
import { UserMenu } from "@/components/dashboard/left/UserMenu";
import { ProfileDialog } from "@/components/dashboard/left/ProfileDialog";
import { SettingsDialog } from "@/components/dashboard/left/SettingsDialog";

/*
 TODO (UserCard)
 - Get authenticated user data from auth context/store instead of props
 - Subscribe to real-time presence updates (WebSocket) to update user status
 - Add loading state while user data is being fetched
 - Handle avatar upload/update functionality
 - Implement actual sign out logic that calls backend /auth/logout endpoint
 - Add error handling for failed avatar loads
 - Cache user data to reduce API calls
 - Add user badge/role display (admin, moderator, etc.)
 - Implement user settings persistence to backend
*/

export type User = {
  id?: string | null;
  username: string;
  avatar?: string;
  status?: string; // TODO: Backend should provide: 'online' | 'away' | 'busy' | 'offline'
  badge?: string | boolean; // TODO: Backend should provide user role/badge type
};

type Props = {
  user: User;
  collapsed?: boolean;
};

export const UserCard = ({ user, collapsed = false }: Props) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const statusBg = userStatus(user.status);

  // TODO: Add loading state for user data
  // const [isLoading, setIsLoading] = useState(false);

  // TODO: Subscribe to presence updates
  // useEffect(() => {
  //   const unsubscribe = subscribeToPresence(user.id, (newStatus) => {
  //     Update user status in real-time
  //   });
  //   return () => unsubscribe();
  // }, [user.id]);

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
      <Card className="w-full min-w-0 items-start rounded-lg p-2">
        <CardContent className="flex min-w-0 items-center gap-3 p-2.5">
          <UserMenu
            onSignOut={() => {
              // TODO: Implement sign out logic
              // 1. Call backend POST /api/auth/logout to invalidate session/token
              // 2. Clear auth token from localStorage/cookies
              // 3. Clear user data from auth store/context
              // 4. Disconnect WebSocket connection
              // 5. Redirect to login page
              console.log("Sign out clicked - TODO: implement");
            }}
            onOpenProfile={() => setProfileOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          >
            <div className="relative flex-shrink-0">
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarImage
                  src={user.avatar || "/images/default-avatar.jpg"}
                  alt={user.username}
                  onError={(e) => {
                    // TODO: Track failed avatar loads and report to backend
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
          </UserMenu>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium">
                {user.username}
              </span>
              {/* TODO: Display user badge/role from backend */}
              {/* {user.badge && <Badge variant="secondary">{user.badge}</Badge>} */}
            </div>
            <div className="text-muted-foreground truncate text-xs">
              {user.status === "online"
                ? "Active now"
                : (user.status ?? "Offline")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TODO: Pass user data to dialogs and implement save functionality */}
      {/* ProfileDialog should: 
          - GET /api/users/:id for full profile data
          - PUT /api/users/:id to update profile
          - POST /api/users/:id/avatar to upload new avatar
      */}
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />

      {/* TODO: SettingsDialog should:
          - GET /api/users/:id/settings
          - PUT /api/users/:id/settings to save preferences
          - Handle notification preferences, privacy settings, etc.
      */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};
