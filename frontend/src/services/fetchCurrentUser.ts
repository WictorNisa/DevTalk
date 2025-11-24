import { normalizePresenceStatus } from "@/utils/normalizeStatus";
import type { CurrentUser } from "@/types/User";
import { API_BASE_URL } from "@/config/api";

const deriveGitHubAvatar = (externalId?: string) => {
  if (!externalId) return "";
  return /^\d+$/.test(externalId)
    ? `https://avatars.githubusercontent.com/u/${externalId}`
    : `https://github.com/${externalId}.png`;
};

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const res = await fetch(`${API_BASE_URL}/api/me`, {
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
