export type CurrentUser = {
  id: string;
  externalId: string;
  displayName: string;
  avatarUrl: string;
  presenceStatus?: "Online" | "Offline" | "Away" | "Busy";
};

const deriveGitHubAvatar = (externalId?: string) => {
  if (!externalId) return "";
  return /^\d+$/.test(externalId)
    ? `https://avatars.githubusercontent.com/u/${externalId}`
    : `https://github.com/${externalId}.png`;
};

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const res = await fetch("http://localhost:8080/api/me", {
    credentials: "include",
  });
  if (!res.ok) return null;

  const data = await res.json();

  const avatar =
    data.avatarUrl ||
    data.avatar_url ||
    deriveGitHubAvatar(data.externalId) ||
    "";

  return {
    id: String(data.id ?? ""),
    externalId: data.externalId ?? "",
    displayName: data.displayName || data.externalId || "User",
    avatarUrl: avatar,
    presenceStatus: data.presenceStatus || "Online",
  };
}
