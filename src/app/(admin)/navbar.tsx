import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Pencil, Image, MessageSquare, LogOut, Settings, Shield } from "lucide-react";
import { signOutAction } from "@/lib/signout-action";

const allLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { href: "/admin/editor", label: "Editor", icon: Pencil, adminOnly: false },
  { href: "/admin/media", label: "Media", icon: Image, adminOnly: false },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare, adminOnly: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, adminOnly: true },
  { href: "/admin/access", label: "Access", icon: Shield, adminOnly: true },
];

export function AdminNavbar({ userRole }: { userRole: "admin" | "editor" }) {
  const visible = allLinks.filter((l) => !l.adminOnly || userRole === "admin");

  return (
    <header className="border-b border-border bg-paper-shadow">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-1">
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

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="rounded-none font-sans uppercase text-[0.625rem] tracking-wider border-border text-muted-foreground"
          >
            {userRole}
          </Badge>
          <form action={signOutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="nav-link text-[0.6875rem] gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
