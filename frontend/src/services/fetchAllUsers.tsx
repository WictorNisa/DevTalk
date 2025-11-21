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

    const backendUsers: User[] = await response.json();

    return backendUsers.map((users) => ({
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
