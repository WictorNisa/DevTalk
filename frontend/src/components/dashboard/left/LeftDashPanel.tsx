import LeftBottomWidget from "./LeftBottomWidget";
import LeftCenterWidget from "./LeftCenterWidget";
import LogoPanel from "./LogoPanel";

const LeftDashPanel = ({ collapsed = false }: { collapsed?: boolean }) => {
  return (
    <div className="flex h-full w-full min-w-0 flex-col gap-2 rounded">
      <LogoPanel />
      <div className="min-w-0 flex-1 overflow-auto">
        <LeftCenterWidget collapsed={collapsed} />
      </div>
      <LeftBottomWidget collapsed={collapsed} />
    </div>
  );
};

export default LeftDashPanel;
