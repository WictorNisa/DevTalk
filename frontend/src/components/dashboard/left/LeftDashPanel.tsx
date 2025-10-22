import LeftBottomWidget from "./LeftBottomWidget";
import LeftCenterWidget from "./LeftCenterWidget";
import LogoPanel from "./LogoPanel";

const LeftDashPanel = () => {
  return (
    <div className="flex h-full w-full flex-col gap-2 rounded">
      <LogoPanel />
      <LeftCenterWidget />
      <LeftBottomWidget />
    </div>
  );
};

export default LeftDashPanel;
