"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton({
  variant = "ghost",
  size = "sm",
  className,
}: {
  variant?: "ghost" | "link";
  size?: "default" | "sm";
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut className="h-3.5 w-3.5" />
      Sign Out
    </Button>
  );
}
