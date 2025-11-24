import { API_BASE_URL } from "@/config/api";
import type { User, BackendUser } from "@/types/User";
import type { PresenceStatus } from "@/utils/normalizeStatus";

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users ${response.status}`);
    }

    const backendUsers: BackendUser[] = await response.json();

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
