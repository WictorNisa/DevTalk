// import dummyUsers from "@/data/dummyUsers.json";
import { UserCard } from "@/components/dashboard/left/UserCard";

const LeftBottomWidget = ({ collapsed = false }: { collapsed?: boolean }) => {
  return <UserCard collapsed={collapsed} />;
};

export default LeftBottomWidget;
