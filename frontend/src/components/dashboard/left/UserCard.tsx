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
  // TODO:
  // - Map backend response to `User` shape (id, username, avatar, status, badge/roles).
  // - Normalize & sanitize avatar URLs (CDN / signed URLs); reject unsafe data: URIs.
  // - Add <AvatarImage onError=> fallback to local default avatar.
  // - Subscribe to presence (WebSocket / realtime) to update `status` live.
  // - Render badges/roles from backend and add accessible label/tooltip.
  // - Add loading / skeleton state while fetching current user.
  // - Implement caching strategy for avatar images and presence updates.
  // - Add unit tests for userStatus mapping, avatar fallback and collapsed UI.
  // - Ensure accessibility: aria-label, alt text, keyboard focus states.
  // - Log telemetry for avatar load errors / invalid API payloads.
  const statusBg = userStatus(user.status);

  if (collapsed) {
    return (
      <div className="flex items-center justify-center p-1">
        <div className="relative">
          <Avatar className="h-7 w-7 rounded-full">
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
    <Card className="w-full rounded-lg p-2">
      <CardContent className="flex items-start gap-3 p-0">
        <div className="relative">
          <Avatar className="h-10 w-10 rounded-full">
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

        <div className="flex flex-col items-center text-xs font-medium">
          <span>{user.username}</span>
          <span className="sr-only">{user.status}</span>
        </div>
      </CardContent>
    </Card>
  );
};
