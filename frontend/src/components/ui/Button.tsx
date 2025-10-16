import type React from "react";
import { cn } from "@utils/cnHelper"; // your cn helper

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "flex items-center justify-center rounded-lg transition-opacity hover:cursor-pointer hover:opacity-90";

  const variants = {
    primary: "bg-[var(--main-bg-color)]",
    secondary: "bg-gray-600",
    ghost: "bg-transparent hover:bg-gray-800",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3.5 text-base sm:px-5 sm:py-4 sm:text-lg",
    lg: "px-6 py-5 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
