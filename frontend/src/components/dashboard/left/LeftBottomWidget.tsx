import dummyUsers from "@/data/dummyUsers.json";
import { Card } from "@/components/ui/card";
import { UserCard, type User } from "@/components/dashboard/left/UserCard";

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
      // allow the status dot to overflow and reduce padding when collapsed
      className={`flex items-center gap-3 rounded-lg ${
        collapsed ? "justify-center overflow-visible p-1" : "p-2"
      }`}
    >
      <UserCard user={user} collapsed={collapsed} />
    </Card>
  );
};

export default LeftBottomWidget;
