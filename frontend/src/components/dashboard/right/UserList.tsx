import dummyUsers from "@/data/dummyUsers.json";
import { UserListCard } from "./UserListCard";

type User = {
  username: string;
  avatar?: string;
  status?: string;
  badge?: string | boolean;
};

export const UserList = ({ collapsed = false }: { collapsed?: boolean }) => {
  // use dummyUsers when present, otherwise use the local fallback
  const fallbackUsers: User[] = [
    { username: "AlexCoder", avatar: "/images/alex.jpg", status: "online" },
    { username: "SarahDev", avatar: "/images/sarah.jpg", status: "idle" },
    { username: "MikeDesign", avatar: "/images/mike.jpg", status: "busy" },
    { username: "Pedro", avatar: "/images/pedro.jpg", status: "busy" },
    { username: "DeezNuts", avatar: "/images/deeznuts.jpg", status: "online" },
    {
      username: "MustafaJunior",
      avatar: "/images/mustafajunior.jpg",
      status: "idle",
    },
    {
      username: "MuricanCitizen",
      avatar: "/images/muricancitizen.jpg",
      status: "offline",
    },
    { username: "JaneTester", status: undefined },
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
        <UserListCard key={u.username} {...u} collapsed={collapsed} />
      ))}
    </div>
  );
};
