import LeftBottomWidget from "./LeftBottomWidget";
import LeftCenterWidget from "./LeftCenterWidget";
import LeftTopWidget from "./LeftTopWidget";

const LeftDashPanel = () => {
  return (
    <div className="flex h-full w-1/5 flex-col gap-2 rounded">
      <LeftTopWidget />
      <LeftCenterWidget />
      <LeftBottomWidget />
    </div>
  );
};

export default LeftDashPanel;
