import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { UserListCard } from "./UserListCard";
import { fetchAllUsers } from "@/services/fetchAllUsers";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProfileDialog } from "../ProfileDialog";
import { normalizePresenceStatus } from "@/utils/normalizeStatus";
import type { User } from "@/types/User";

export const UserList = ({ collapsed = false }: { collapsed?: boolean }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // using User type for selectedUser (to show with ProfileDialog)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const offlineUsers = users.filter(
    (userStatus) => userStatus.status === "Offline",
  );

  const activeUsers = users.filter(
    (userStatus) => userStatus.status !== "Offline",
  );
  const { t } = useTranslation("dashboard");

  // map UserList User to ProfileDialog's User type
  const handleUserClick = (user: User) => {
    const profileUser: User = {
      id: user.id || "",
      displayName: user.displayName || "User",
      externalId: null,
      avatarUrl: user.avatar,
      presenceStatus: normalizePresenceStatus(user.status),
    };
    setSelectedUser(profileUser);
    setProfileDialogOpen(true);
  };

  const didInitialFetch = useRef(false);

  const loadUsers = async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      const fetchedUsers = await fetchAllUsers();
      const normalizedUsers = fetchedUsers.map((user) => ({
        ...user,
        status: normalizePresenceStatus(user.status) ?? "Offline",
      }));
      setUsers(normalizedUsers);
      setError(null);
    } catch (err) {
      console.error("Error loading users:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    loadUsers(!didInitialFetch.current);
    didInitialFetch.current = true;

    const pollId = setInterval(() => loadUsers(false), 500);
    return () => clearInterval(pollId);
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
        <div className="text-muted-foreground mb-2 flex flex-col justify-start gap-3">
          <span className={`text-sm font-medium ${collapsed ? "hidden" : ""}`}>
            {t("sidebarRight.active", { count: activeUsers.length })}
          </span>
          {activeUsers.map((user) => (
            <UserListCard
              key={user.id}
              {...user}
              username={user.displayName || "User"}
              collapsed={collapsed}
              onClick={() => handleUserClick(user)}
            />
          ))}
        </div>

        <div className="text-muted-foreground mb-2 flex flex-col justify-start gap-3">
          <span className={`text-sm font-medium ${collapsed ? "hidden" : ""}`}>
            {t("sidebarRight.inactive", { count: offlineUsers.length })}
          </span>
          {offlineUsers.map((user) => (
            <UserListCard
              key={user.id}
              {...user}
              username={user.displayName || "User"}
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
