export type UserCardProps = {
  avatar?: string; // optional URL
  username: string; // required username
  status?: "online" | "idle" | "busy" | string; // optional status
  badge?: boolean | string; // presence flag or optional label
};
