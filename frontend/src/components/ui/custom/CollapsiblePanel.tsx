import { useSidebarStates } from "@stores/useSidebarStates";
import { motion } from "framer-motion";
import { Button } from "../button";
import {
  ArrowLeftFromLine,
  ArrowLeftToLine,
  ArrowRightFromLine,
  ArrowRightToLine,
} from "lucide-react";

interface CollapsiblePanelProps {
  children: React.ReactNode;
  side: "left" | "right";
}

export const CollapsiblePanel = ({ children, side }: CollapsiblePanelProps) => {
  const { isLeftCollapsed, isRightCollapsed, toggleLeft, toggleRight } =
    useSidebarStates();

  const isCollapsed = side === "left" ? isLeftCollapsed : isRightCollapsed;
  const toggle = side === "left" ? toggleLeft : toggleRight;

  const getToggleIcon = () => {
    if (side === "left") {
      return isCollapsed ? <ArrowRightFromLine /> : <ArrowLeftToLine />;
    } else {
      return isCollapsed ? <ArrowLeftFromLine /> : <ArrowRightToLine />;
    }
  };

  const expandedWidth = "20%";
  const collapsedWidth = side === "left" ? "3%" : "3%";

  const toggleButton = (
    <Button
      onClick={toggle}
      className={`absolute h-full bg-transparent text-[var(--ring)] hover:bg-transparent hover:text-[var(--foreground)] ${side === "left" ? "right-0" : "left-0"}`}
    >
      {getToggleIcon()}
    </Button>
  );

  return (
    <motion.div
      className={`flex h-full ${side === "right" ? "ml-auto" : ""} relative z-10`}
      animate={{
        width: isCollapsed ? collapsedWidth : expandedWidth,
        transformOrigin: side === "left" ? "left" : "right",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {side === "left" ? (
        <>
          <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
          {toggleButton}
        </>
      ) : (
        <>
          {toggleButton}
          <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
        </>
      )}
    </motion.div>
  );
};
