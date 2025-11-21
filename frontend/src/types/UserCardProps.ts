import type { PresenceStatus } from "@/utils/normalizeStatus";

export type UserCardProps = {
  avatar?: string;
  username: string;
  status?: PresenceStatus;
  badge?: boolean | string;
};
