import { cn } from "@utils/cnHelper";
import type React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={cn(
        "flex h-1/12 w-full flex-col rounded-lg bg-[var(--surface-md-dark)] p-2 text-white",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;
