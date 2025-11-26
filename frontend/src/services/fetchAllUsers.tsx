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

    const allUsers = (await Promise.all(requests)).flat();

    return allUsers.map((users) => ({
      id: users.id.toString(),
      displayName: users.displayName,
      avatar:
        users.avatarUrl ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${users.displayName}`,
      status: users.presenceStatus?.toLowerCase() as PresenceStatus | undefined,
      badge: users.role ?? undefined,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
