import dummyUsers from "@/data/dummyUsers.json";
import { Card } from "@/components/ui/card";
import { UserCard, type User } from "@/components/dashboard/left/UserCard";
// import { UserMenu } from "@/components/dashboard/left/UserMenu";

/*
 TODO (LeftBottomWidget)
 - Replace dummyUsers fallback with authenticated current user (from auth/context).
 - Normalize & sanitize avatar URLs in a shared helper (handle CDN/signed URLs).
 - Provide loading/skeleton state while user data resolves.
 - Use presence subscription (WebSocket / realtime) to update `status` live.
 - Add avatar onError fallback to prevent broken images from clipping layout.
 - Consider caching avatar & presence data and invalidation strategy.
*/

const LeftBottomWidget = ({ collapsed = false }: { collapsed?: boolean }) => {
  const fallbackUser: User = {
    id: "me",
    username: "You",
    avatar: "/images/default-avatar.jpg",
    status: "online",
  };

  const firstFromJson =
    Array.isArray(dummyUsers) && dummyUsers.length > 0
      ? (dummyUsers[0] as User)
      : undefined;

  const rawAvatar = firstFromJson?.avatar ?? fallbackUser.avatar;

  const user: User = {
    ...fallbackUser,
    ...firstFromJson,
    avatar:
      typeof rawAvatar === "string"
        ? rawAvatar.startsWith("/") || rawAvatar.startsWith("http")
          ? rawAvatar
          : `/${rawAvatar}`
        : fallbackUser.avatar,
  };

  return (
    <Card
      className={`flex h-auto items-center gap-2 rounded-lg ${
        collapsed ? "justify-center overflow-visible p-1" : "p-2"
      }`}
    >
      <UserCard user={user} collapsed={collapsed} />
    </Card>
  );
};

export default LeftBottomWidget;
