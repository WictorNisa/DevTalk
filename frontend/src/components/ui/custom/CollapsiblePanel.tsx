import React from "react";
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

  const expandedWidth = "220px";
  const collapsedWidth = side === "left" ? "54px" : "54px";

  const toggleButton = (
    <Button
      onClick={toggle}
      className={`text-ring hover:text-foreground absolute z-30 flex w-8 -translate-y-1/2 transform cursor-pointer items-center justify-center bg-transparent hover:bg-transparent ${side === "left" ? "right-0" : "left-0"}`}
      style={{ top: "50%" }}
      aria-label={side === "left" ? "Toggle left panel" : "Toggle right panel"}
    >
      {getToggleIcon()}
    </Button>
  );

  const childrenWithCollapsed = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const element = child as React.ReactElement<{ collapsed?: boolean }>;

    return React.cloneElement(element, { collapsed: isCollapsed });
  });

  return (
    <motion.div
      className={`flex h-full ${side === "right" ? "ml-auto" : ""} relative z-10 min-w-0`}
      animate={{
        width: isCollapsed ? collapsedWidth : expandedWidth,
        transformOrigin: side === "left" ? "left" : "right",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {side === "left" ? (
        <>
          <div className="min-w-0 flex-1 overflow-hidden">
            {childrenWithCollapsed}
          </div>
          {toggleButton}
        </>
      ) : (
        <>
          {toggleButton}
          <div className="min-w-0 flex-1 overflow-hidden">
            {childrenWithCollapsed}
          </div>
        </>
      )}
    </motion.div>
  );
};
