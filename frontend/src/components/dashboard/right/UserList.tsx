import dummyUsers from "@/data/dummyUsers.json";
import { UserListCard } from "./UserListCard";

/*
 TODO (UserList)
 - Replace dummyUsers with authenticated / backend users (via auth/context or API).
 - Move avatar normalisation into a shared helper (handle CDN / signed URLs).
 - Add loading / skeleton state while users list is fetched.
 - Deduplicate users by id and ensure stable keys (avoid using undefined ids).
 - Consider virtualisation if the list grows large.
*/

type User = {
  id: string | null | undefined;
  username: string;
  avatar?: string;
  status?: string;
  badge?: string | boolean;
};

export const UserList = ({ collapsed = false }: { collapsed?: boolean }) => {
  // local fallback users (keeps same shape used elsewhere)
  const fallbackUsers: User[] = [
    {
      username: "AlexCoder",
      avatar: "/images/alex.jpg",
      status: "online",
      id: undefined,
    },
    {
      username: "SarahDev",
      avatar: "/images/sarah.jpg",
      status: "idle",
      id: undefined,
    },
    {
      username: "MikeDesign",
      avatar: "/images/mike.jpg",
      status: "busy",
      id: undefined,
    },
    {
      username: "Pedro",
      avatar: "/images/pedro.jpg",
      status: "busy",
      id: undefined,
    },
    {
      username: "DeezNuts",
      avatar: "/images/deeznuts.jpg",
      status: "online",
      id: undefined,
    },
    {
      username: "MustafaJunior",
      avatar: "/images/mustafajunior.jpg",
      status: "idle",
      id: undefined,
    },
    {
      username: "MuricanCitizen",
      avatar: "/images/muricancitizen.jpg",
      status: "offline",
      id: undefined,
    },
    {
      username: "JaneTester",
      status: undefined,
      id: undefined,
    },
  ];

  const usersFromJson = Array.isArray(dummyUsers)
    ? (dummyUsers as User[]).map((u) => ({
        ...u,
        // ensure avatar path is resolvable by the app (prepend slash if missing)
        avatar:
          typeof u.avatar === "string"
            ? u.avatar.startsWith("/") || u.avatar.startsWith("http")
              ? u.avatar
              : `/${u.avatar}`
            : u.avatar,
      }))
    : [];

  const users: User[] = usersFromJson.length ? usersFromJson : fallbackUsers;

  return (
    <div className={`flex flex-col gap-2 ${collapsed ? "items-center" : ""}`}>
      {users.map((u) => (
        <UserListCard key={u.id} {...u} collapsed={collapsed} />
      ))}
    </div>
  );
};
