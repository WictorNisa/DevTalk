import { Card, CardContent } from "@components/ui/card";
import { UserList } from "./UserList";

const RightDashPanel = () => {
  return (
    <Card className="flex h-full w-full p-1">
      <CardContent className="p-1">
        <UserList />
      </CardContent>
    </Card>
  );
};

export default RightDashPanel;
