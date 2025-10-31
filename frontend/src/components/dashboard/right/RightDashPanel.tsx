import { Card, CardContent } from "@components/ui/card";
import { UserList } from "./UserList";

const RightDashPanel = ({ collapsed = false }: { collapsed?: boolean }) => {
  return (
    <Card className="flex h-full w-full rounded-lg p-2">
      <CardContent className="h-full w-full overflow-auto p-0">
        <UserList collapsed={collapsed} />
      </CardContent>
    </Card>
  );
};

export default RightDashPanel;
