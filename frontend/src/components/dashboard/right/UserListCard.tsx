import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { UserCardProps } from "@/types/UserCardProps";
import { userStatus } from "@/utils/userStatus";

/*
 TODO (UserListCard)
 - Use backend user DTO -> UserCardProps mapping when API is available.
 - Add <AvatarImage onError=> handler to swap to a local fallback image.
 - Normalize & validate avatar URLs in a shared util (reject data: URIs).
 - Add accessibility improvements: aria-label on wrappers, descriptive alt text.
 - Add unit tests for collapsed/expanded UI and status mapping.
*/

export const UserListCard = ({
  avatar,
  username,
  status,
  collapsed = false,
  onClick,
}: UserCardProps & { collapsed?: boolean; onClick?: () => void }) => {
  const statusBg = userStatus(status);

  if (collapsed) {
    return (
      <div
        className="flex cursor-pointer items-center justify-center p-1 transition-opacity hover:opacity-80"
        onClick={onClick}
      >
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
            className={`${statusBg} ring-primary-foreground absolute right-0 bottom-0 h-2 w-2 rounded-full ring-1`}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  return (
    <Card
      className="hover:bg-accent w-full min-w-0 cursor-pointer rounded-lg p-2 transition-colors"
      onClick={onClick}
    >
      <CardContent className="flex min-w-0 items-center gap-3 p-0">
        <div className="relative flex-shrink-0">
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
            className={`${statusBg} ring-primary-foreground absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full ring-1`}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1 flex-col text-xs font-medium">
          <span className="block truncate">{username}</span>
          <span className="sr-only">{status}</span>
        </div>
      </CardContent>
    </Card>
  );
};
