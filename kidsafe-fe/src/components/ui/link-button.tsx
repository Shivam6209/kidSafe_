import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

/**
 * A button that uses Next.js Link for proper client-side navigation
 * This retains all the Next.js client-side navigation benefits
 */
export function LinkButton({
  href,
  children,
  variant = "default",
  size = "default",
  className = "",
}: LinkButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      asChild
    >
      <Link href={href}>
        {children}
      </Link>
    </Button>
  );
} 