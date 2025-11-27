import type { User } from "@/types/User";
import type { PresenceStatus } from "@/utils/normalizeStatus";

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const statuses = ["ONLINE", "AWAY", "BUSY", "OFFLINE"] as const;

    const requests = statuses.map((status) =>
      fetch(`http://localhost:8080/api/users/status?status=${status}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (!res.ok) throw new Error(`Failed status ${status}: ${res.status}`);
        return res.json();
      }),
    );

<<<<<<< HEAD:frontend/src/services/fetchAllUsers.ts
    const users: User[] = await response.json();

    return users.map((user) => ({
      id: user.id.toString(),
      displayName: user.displayName,
=======
    const allUsers = (await Promise.all(requests)).flat();

    return allUsers.map((users) => ({
      id: users.id.toString(),
      displayName: users.displayName,
>>>>>>> main:frontend/src/services/fetchAllUsers.tsx
      avatar:
        user.avatarUrl ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`,
      status: user.presenceStatus?.toLowerCase() as PresenceStatus | undefined,
      badge: user.role ?? undefined,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
