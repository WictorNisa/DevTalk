import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { UserCardProps } from "@/types/UserCardProps";
import { Avatar } from "@/components/ui/avatar";

export const UserListCard = ({
  avatar,
  username,
  status,
  collapsed = false,
}: UserCardProps & { collapsed?: boolean }) => {
  const s = (status || "").toLowerCase();
  let statusBg = "bg-gray-400";

  switch (s) {
    case "online":
      statusBg = "bg-green-400";
      break;
    case "idle":
      statusBg = "bg-yellow-400";
      break;
    case "busy":
      statusBg = "bg-red-400";
      break;
  }

  if (collapsed) {
    return (
      <div className="flex items-center justify-center p-1">
        <div className="relative">
          <Avatar className="h-6 w-6 rounded-full">
            <AvatarImage
              src={avatar || "https://placehold.co/120"}
              alt={username}
            />
            <AvatarFallback>
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span
            className={`${statusBg} absolute right-0 bottom-0 h-2 w-2 rounded-full ring-1 ring-gray-400`}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  return (
    <Card className="rounded-lg p-2">
      <CardContent className="flex items-center gap-3 p-0">
        <div className="relative">
          <Avatar className="h-9 w-9 rounded-full">
            <AvatarImage
              src={avatar || "https://placehold.co/120"}
              alt={username}
            />
            <AvatarFallback>
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span
            className={`${statusBg} ring-primary-foreground absolute right-0 bottom-0 h-3 w-3 rounded-full ring-1`}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col text-xs font-medium">
          <span>{username}</span>
          <span className="sr-only">{status}</span>
        </div>
      </CardContent>
    </Card>
  );
};
