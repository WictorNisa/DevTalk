import LeftBottomWidget from "./LeftBottomWidget";
import LeftCenterWidget from "./LeftCenterWidget";
import LogoPanel from "./LogoPanel";

const LeftDashPanel = ({ collapsed = false }: { collapsed?: boolean }) => {
  return (
    <div className="flex h-full w-full flex-col gap-2 rounded">
      <LogoPanel />
      <LeftCenterWidget />
      <LeftBottomWidget collapsed={collapsed} />
    </div>
  );
};

export default LeftDashPanel;
