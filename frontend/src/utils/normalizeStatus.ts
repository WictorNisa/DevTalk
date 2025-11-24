export type PresenceStatus = "Online" | "Offline" | "Away" | "Busy";

/**
 * Normalizes a status string from the backend to a valid PresenceStatus type.
 * Handles case-insensitive matching and provides a fallback for invalid values.
 * 
 * @param status - The status string from the backend (can be any case)
 * @returns A valid PresenceStatus value or undefined if input is invalid
 */
export const normalizePresenceStatus = (
  status?: string | null
): PresenceStatus | undefined => {
  if (!status) return undefined;

  const normalizedStatus = status.trim().toLowerCase();

  switch (normalizedStatus) {
    case "online":
      return "Online";
    case "offline":
      return "Offline";
    case "away":
    case "idle": // Map "idle" to "Away" as an alias
      return "Away";
    case "busy":
    case "dnd": // Map "do not disturb" to "Busy" as an alias
      return "Busy";
    default:
      console.warn(`Unknown presence status received: "${status}". Defaulting to undefined.`);
      return undefined;
  }
};
