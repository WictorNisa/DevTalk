import type { PresenceStatus } from "@/utils/normalizeStatus";

export async function updatePresenceStatus(
  status: PresenceStatus,
): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:8080/api/me/status", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (e) {
    console.error("Failed to update presence status", e);
    return false;
  }
}
