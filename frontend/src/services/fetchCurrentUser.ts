import { normalizePresenceStatus } from "@/utils/normalizeStatus";
import type { User } from "@/types/User";

const deriveGitHubAvatar = (externalId?: string) => {
  if (!externalId) return "";
  return /^\d+$/.test(externalId)
    ? `https://avatars.githubusercontent.com/u/${externalId}`
    : `https://github.com/${externalId}.png`;
};

const mapUserData = (data: any): User => ({
  id: String(data.id ?? ""),
  externalId: data.externalId ?? null,
  displayName: data.displayName || data.externalId || "User",
  avatarUrl: data.avatarUrl || deriveGitHubAvatar(data.externalId) || "",
  presenceStatus: normalizePresenceStatus(data.presenceStatus) || undefined,
});

const fetchFromEndpoint = async (url: string): Promise<User | null> => {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  return mapUserData(await response.json());
};

export const fetchCurrentUser = async (): Promise<User | null> => {
  const endpoints = [
    "http://localhost:8080/api/me",
    "http://localhost:8080/api/users/current",
  ];

  for (const endpoint of endpoints) {
    try {
      return await fetchFromEndpoint(endpoint);
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
    }
  }

  return null;
};
