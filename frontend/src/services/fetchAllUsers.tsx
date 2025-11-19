interface BackendUser {
  id: number;
  externalId: string;
  displayName: string;
  avatarUrl?: string;
  presenceStatus: string;
  role?: string;
}

interface User {
  id: string;
  username: string;
  avatar?: string;
  status?: string;
  badge?: string | boolean;
}

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

    const backendUsers: BackendUser[] = await response.json();

    return backendUsers.map((users) => ({
      id: users.id.toString(),
      username: users.displayName,
      avatar:
        users.avatarUrl ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${users.displayName}`,
      status: users.presenceStatus?.toLowerCase(),
      badge: users.role,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
