import CenterBottomWidget from "./CenterBottomWidget";
import CenterTopWidget from "./CenterTopWidget";

const CenterDashPanel = () => {
  return (
    <div className="flex h-full w-3/5 flex-1 flex-col gap-2">
      <CenterTopWidget />
      <CenterBottomWidget />
    </div>
  );
};

export default CenterDashPanel;
