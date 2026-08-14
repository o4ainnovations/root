"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Pencil,
  Image,
  MessageSquare,
  Settings,
  Shield,
  Menu,
  X,
  Home,
} from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";

const allLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { href: "/admin/editor", label: "Editor", icon: Pencil, adminOnly: false },
  { href: "/admin/media", label: "Media", icon: Image, adminOnly: false },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare, adminOnly: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, adminOnly: true },
  { href: "/admin/access", label: "Access", icon: Shield, adminOnly: true },
];

export function AdminNavbar({ userRole }: { userRole: "admin" | "editor" }) {
  const [open, setOpen] = useState(false);
  const visible = allLinks.filter((l) => !l.adminOnly || userRole === "admin");

  return (
    <header className="border-b border-border bg-paper-shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <span className="font-heading font-bold text-ink text-sm uppercase tracking-widest sm:hidden">
          Admin
        </span>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/"
            aria-label="Home"
            className="nav-link px-3 py-2 hover:bg-paper-highlight transition-colors flex items-center gap-1.5"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
          {visible.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-[0.6875rem] px-3 py-2 hover:bg-paper-highlight transition-colors flex items-center gap-1.5"
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <Badge
            variant="outline"
            className="rounded-none font-sans uppercase text-[0.625rem] tracking-wider border-border text-muted-foreground"
          >
            {userRole}
          </Badge>
          <SignOutButton className="nav-link text-[0.6875rem] gap-1.5" />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="sm:hidden p-2 -mr-2 text-ink hover:bg-paper-highlight transition-colors"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-border">
          <nav className="px-2 py-2 flex flex-col">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="nav-link text-sm px-3 py-2.5 hover:bg-paper-highlight transition-colors flex items-center gap-2.5"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            {visible.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="nav-link text-sm px-3 py-2.5 hover:bg-paper-highlight transition-colors flex items-center gap-2.5"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-border">
            <Badge
              variant="outline"
              className="rounded-none font-sans uppercase text-[0.625rem] tracking-wider border-border text-muted-foreground"
            >
              {userRole}
            </Badge>
            <SignOutButton className="nav-link text-[0.6875rem] gap-1.5" />
          </div>
        </div>
      )}
    </header>
  );
}
