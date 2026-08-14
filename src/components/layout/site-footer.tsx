"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

export function SiteFooter() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/studio");

  if (isAdmin) return null;

  return <Footer />;
}
