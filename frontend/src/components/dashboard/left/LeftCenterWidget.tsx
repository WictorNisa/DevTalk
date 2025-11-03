import { Card } from "@/components/ui/card";

const LeftCenterWidget = () => {
  return (
    <Card className="h-full rounded-lg">
      <span className="font-regular text-sm">Channels</span>
      <Card>
        <span className="font-regular text-sm">General</span>
        <span className="font-regular text-sm">Frontend</span>
        <span className="font-regular text-sm">Backend</span>
      </Card>
    </Card>
  );
};

export default LeftCenterWidget;
