import type { PresenceStatus } from "@/utils/normalizeStatus";

export type User = {
  id: string;
  externalId?: string | null;
  displayName: string;
  avatarUrl?: string;
  avatar?: string;
  presenceStatus?: PresenceStatus;
  status?: PresenceStatus;
  role?: string | null;
  badge?: string | boolean;
  lastActivityAt?: string | null;
  customStatusMessage?: string | null;
};

export type CurrentUser = User;
