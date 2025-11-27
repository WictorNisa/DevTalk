import { normalizePresenceStatus } from "@/utils/normalizeStatus";
import type { User } from "@/types/User";

const deriveGitHubAvatar = (externalId?: string) => {
  if (!externalId) return "";
  return /^\d+$/.test(externalId)
    ? `https://avatars.githubusercontent.com/u/${externalId}`
    : `https://github.com/${externalId}.png`;
};

export async function fetchCurrentUser(): Promise<User | null> {
  const res = await fetch("http://localhost:8080/api/me", {
    credentials: "include",
  });
  if (!res.ok) return null;

  const data = await res.json();

  const avatar = data.avatarUrl || deriveGitHubAvatar(data.externalId) || "";

  return {
    id: String(data.id ?? ""),
    externalId: data.externalId ?? null,
    displayName: data.displayName || data.externalId || "User",
    avatarUrl: avatar,
    presenceStatus: normalizePresenceStatus(data.presenceStatus) || undefined,
  };
}
