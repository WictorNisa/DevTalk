import CenterDashPanel from "@/components/dashboard/center/CenterDashPanel";
import LeftDashPanel from "@/components/dashboard/left/LeftDashPanel";
import RightDashPanel from "@/components/dashboard/right/RightDashPanel";

const Dashboard = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-2">
      <div className="flex h-full w-full gap-2 rounded">
        <LeftDashPanel />
        <CenterDashPanel />
        <RightDashPanel />
      </div>
    </div>
  );
};

export default Dashboard;
