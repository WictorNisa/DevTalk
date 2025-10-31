import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { userStatus } from "@/utils/userStatus";

export type User = {
  id?: string | null;
  username: string;
  avatar?: string;
  status?: string;
  badge?: string | boolean;
};

type Props = {
  user: User;
  collapsed?: boolean;
};

export const UserCard = ({ user, collapsed = false }: Props) => {
  const statusBg = userStatus(user.status);

  if (collapsed) {
    return (
      <div className="flex items-center justify-center p-1">
        <div className="relative">
          <Avatar className="h-6 w-6 rounded-full">
            <AvatarImage
              src={user.avatar || "https://placehold.co/120"}
              alt={user.username}
            />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
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
              src={user.avatar || "https://placehold.co/120"}
              alt={user.username}
            />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span
            className={`${statusBg} ring-primary-foreground absolute right-0 bottom-0 h-3 w-3 rounded-full ring-1`}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col text-xs font-medium">
          <span>{user.username}</span>
          <span className="sr-only">{user.status}</span>
        </div>
      </CardContent>
    </Card>
  );
};
