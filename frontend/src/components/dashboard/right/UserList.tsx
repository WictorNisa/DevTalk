import { useEffect, useState } from "react";
import { UserListCard } from "./UserListCard";
import { fetchAllUsers } from "@/services/fetchAllUsers";
import { useAuthStore } from "@/stores/useAuthStore";

/*
 TODO (UserList)
 - Replace dummyUsers with authenticated / backend users (via auth/context or API).
 - Move avatar normalisation into a shared helper (handle CDN / signed URLs).
 - Add loading / skeleton state while users list is fetched.
 - Deduplicate users by id and ensure stable keys (avoid using undefined ids).
 - Consider virtualisation if the list grows large.
*/

type User = {
  id: string | null | undefined;
  username: string;
  avatar?: string;
  status?: string;
  badge?: string | boolean;
};

export const UserList = ({ collapsed = false }: { collapsed?: boolean }) => {
  const {
    user: currentUser,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuthStore();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const offlineUsers = users.filter(
    (userStatus) => userStatus.status === "offline",
  );

  const activeUsers = users.filter(
    (userStatus) => userStatus.status !== "offline",
  );

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
    <div className={`flex flex-col gap-2 ${collapsed ? "items-center" : ""}`}>
      <div className="mb-2 flex flex-col gap-3 text-gray-500">
        <span>{`Active - ${activeUsers.length}`} </span>
        {activeUsers.map((user) => (
          <UserListCard key={user.id} {...user} collapsed={collapsed} />
        ))}
      </div>

      <div className="mb-2 flex flex-col gap-3 text-gray-500">
        <span>{`Inactive - ${offlineUsers.length}`} </span>
        {offlineUsers.map((user) => (
          <UserListCard key={user.id} {...user} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
};
