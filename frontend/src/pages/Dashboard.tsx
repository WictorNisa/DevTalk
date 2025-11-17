import CenterDashPanel from "@/components/dashboard/center/CenterDashPanel";
import LeftDashPanel from "@/components/dashboard/left/LeftDashPanel";
import RightDashPanel from "@/components/dashboard/right/RightDashPanel";
import { CollapsiblePanel } from "@/components/ui/custom/CollapsiblePanel";

const Dashboard = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden p-2">
      <div className="flex h-full w-full min-w-0 gap-2 rounded">
        <CollapsiblePanel side="left">
          <LeftDashPanel />
        </CollapsiblePanel>
        <div className="flex min-w-0 flex-1">
          <CenterDashPanel />
        </div>
        <CollapsiblePanel side="right">
          <RightDashPanel />
        </CollapsiblePanel>
      </div>
    </div>
  );
};

export default Dashboard;
