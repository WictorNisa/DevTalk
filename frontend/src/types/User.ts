import type { PresenceStatus } from "@/utils/normalizeStatus";

export interface User {
  id: string | number;
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
}

export interface BackendUser {
  id: number;
  externalId: string;
  displayName: string;
  avatarUrl?: string;
  presenceStatus: string;
  role?: string;
}
