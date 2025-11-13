export type CurrentUser = {
  id: string;
  externalId: string;
  displayName: string;
  avatarUrl: string;
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

  const avatar = data.avatarUrl || deriveGitHubAvatar(data.externalId) || "";

  return {
    id: String(data.id ?? ""),
    externalId: data.externalId ?? "",
    displayName: data.displayName || data.externalId || "",
    avatarUrl: avatar,
  };
}
