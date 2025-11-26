import type { User } from "@/types/User";
import type { PresenceStatus } from "@/utils/normalizeStatus";

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch("http://localhost:8080/api/users", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users ${response.status}`);
    }

    const users: User[] = await response.json();

    return users.map((user) => ({
      id: user.id.toString(),
      displayName: user.displayName,
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
