export type UserCardProps = {
  avatar?: string;
  username: string;
  status?: "online" | "idle" | "busy" | string;
  badge?: boolean | string;
};
