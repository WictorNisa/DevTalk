import type { PresenceStatus } from "@/utils/normalizeStatus";

export type UserCardProps = {
  avatar?: string;
  username: string;
  presenceStatus?: PresenceStatus;
  status?: PresenceStatus;
  badge?: boolean | string;
};
