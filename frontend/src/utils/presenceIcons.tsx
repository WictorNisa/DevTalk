import { Circle, Moon, CircleMinus } from "lucide-react";

export const getPresenceIcon = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "online":
      return (
        <Circle className="stroke-card h-3.5 w-3.5 fill-green-500 stroke-2" />
      );
    case "idle":
      return (
        <Moon className="stroke-card h-3.5 w-3.5 fill-yellow-500 stroke-2" />
      );
    case "busy":
      return (
        <CircleMinus className="stroke-card h-3.5 w-3.5 fill-red-500 stroke-2" />
      );
    case "offline":
    default:
      return (
        <Circle className="stroke-card h-3.5 w-3.5 fill-zinc-400 stroke-2" />
      );
  }
};
