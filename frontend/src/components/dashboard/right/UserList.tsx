import dummyUsers from "@/data/dummyUsers.json";
import { UserListCard } from "./UserListCard";

export const UserList = () => {
  return (
    <div className="space-y-2">
      {dummyUsers.map((user) => (
        <UserListCard key={user.id} {...user} />
      ))}
    </div>
  );
};
