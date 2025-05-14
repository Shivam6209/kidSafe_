import React from "react";
import { Button } from "@/components/ui/button";

interface NavigationButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * A reliable navigation button that uses window.location.href for guaranteed navigation
 * This bypasses any router issues in Next.js
 */
export function NavigationButton({
  href,
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
}: NavigationButtonProps) {
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      // Use custom click handler if provided
      onClick(e);
    } else {
      e.preventDefault();
      // Default behavior - navigate to href
      window.location.href = href;
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
} 