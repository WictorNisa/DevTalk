import CenterDashPanel from "@/components/dashboard/center/CenterDashPanel";
import LeftDashPanel from "@/components/dashboard/left/LeftDashPanel";
import RightDashPanel from "@/components/dashboard/right/RightDashPanel";
import { CollapsiblePanel } from "@/components/ui/custom/CollapsiblePanel";

const Dashboard = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-2">
      <div className="flex h-full w-full gap-2 rounded">
        <CollapsiblePanel side="left">
          <LeftDashPanel />
        </CollapsiblePanel>
        <CenterDashPanel />
        <CollapsiblePanel side="right">
          <RightDashPanel />
        </CollapsiblePanel>
      </div>
    </div>
  );
};

export default Dashboard;
