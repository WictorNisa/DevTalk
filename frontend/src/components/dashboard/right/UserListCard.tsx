import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { UserCardProps } from "@/types/UserCardProps";
import { Avatar } from "@/components/ui/avatar";

export const UserListCard = ({ avatar, username, status }: UserCardProps) => {
  let statusColor: string;

  switch (status.toLowerCase()) {
    case "online":
      statusColor = "text-green-400";
      break;
    case "idle":
      statusColor = "text-yellow-400";
      break;
    case "busy":
      statusColor = "text-red-400";
      break;
    default:
      statusColor = "text-zinc-400";
  }

  return (
    <Card className="rounded-md p-3">
      <CardContent className="flex items-center gap-3 px-2">
        <Avatar className="rounded-sm">
          <AvatarImage
            src={avatar || "https://placehold.co/120"}
            alt={username}
          />
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span>{username}</span>
          <span className={statusColor}>{status}</span>
        </div>
      </CardContent>
    </Card>
  );
};
