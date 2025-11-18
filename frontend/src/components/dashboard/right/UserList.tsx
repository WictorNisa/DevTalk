import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { UserListCard } from "./UserListCard";
import { fetchAllUsers } from "@/services/fetchAllUsers";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProfileDialog } from "../ProfileDialog";
// import { Card } from "@/components/ui/card";

type User = {
  id: string | null | undefined;
  username: string;
  avatar?: string;
  status?: string;
  badge?: string | boolean;
};

// added a User type from ProfileDialog to show user details on click
type ProfileUser = {
  id: string;
  displayName?: string | null;
  externalId?: string | null;
  avatarUrl?: string | null;
  lastActivityAt?: string | null;
  customStatusMessage?: string | null;
  presenceStatus?: "Online" | "Offline" | "Away" | "Busy" | undefined;
};

export const UserList = ({ collapsed = false }: { collapsed?: boolean }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // using ProfileUser type for selectedUser (to show with ProfileDialog)
  const [selectedUser, setSelectedUser] = useState<ProfileUser | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const offlineUsers = users.filter(
    (userStatus) => userStatus.status === "offline",
  );

  const activeUsers = users.filter(
    (userStatus) => userStatus.status !== "offline",
  );
  const { t } = useTranslation("dashboard");

  // map UserList User to ProfileDialog's User type
  const handleUserClick = (user: User) => {
    const profileUser: ProfileUser = {
      id: user.id || "",
      displayName: user.username,
      externalId: user.id || "",
      avatarUrl: user.avatar,
      presenceStatus: user.status as
        | "Online"
        | "Offline"
        | "Away"
        | "Busy"
        | undefined,
    };
    setSelectedUser(profileUser);
    setProfileDialogOpen(true);
  };

  useEffect(() => {
    const loadUsers = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedUsers = await fetchAllUsers();
        setUsers(fetchedUsers);
        setError(null);
      } catch (error) {
        console.error("Error loading users:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load users",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [isAuthenticated, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className={`flex flex-col gap-2 ${collapsed ? "items-center" : ""}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-muted h-12 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-sm">Error: {error}</div>;
  }

  if (users.length === 0) {
    return <div className="text-muted-foreground text-sm">No users found</div>;
  }

  return (
    <>
      <div
        className={`font-regular mb-4 flex items-center justify-center p-2 text-sm ${collapsed ? "hidden items-center" : ""}`}
      >
        {t("sidebarRight.members")}
      </div>
      <div className={`flex flex-col gap-2 ${collapsed ? "items-center" : ""}`}>
        <div className="mb-2 flex flex-col justify-start gap-3 text-gray-500">
          <span className={`text-sm font-medium ${collapsed ? "hidden" : ""}`}>
            {t("sidebarRight.active", { count: activeUsers.length })}
          </span>
          {activeUsers.map((user) => (
            <UserListCard
              key={user.id}
              {...user}
              collapsed={collapsed}
              onClick={() => handleUserClick(user)}
            />
          ))}
        </div>

        <div className="mb-2 flex flex-col justify-start gap-3 text-gray-500">
          <span className={`text-sm font-medium ${collapsed ? "hidden" : ""}`}>
            {t("sidebarRight.inactive", { count: offlineUsers.length })}
          </span>
          {offlineUsers.map((user) => (
            <UserListCard
              key={user.id}
              {...user}
              collapsed={collapsed}
              onClick={() => handleUserClick(user)}
            />
          ))}
        </div>
      </div>
      <ProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        user={selectedUser}
      />
    </>
  );
};
