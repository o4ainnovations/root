"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/investors", label: "Investors" },
  { href: "/news", label: "News" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function PlatformNav() {
  const pathname = usePathname();

  return (
    <div className="border-t border-border bg-background">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link
          href="/"
          className="font-heading text-lg font-bold text-ink tracking-tight mr-2"
        >
          O4A
        </Link>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "nav-link text-[0.8125rem]",
              pathname === link.href && "nav-link-active",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
