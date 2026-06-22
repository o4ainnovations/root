import { sanityFetch } from "@/lib/sanity";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Newspaper, FileText } from "lucide-react";
import Link from "next/link";
import type { Subsidiary, TeamMember, PressRelease, Download } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [subsidiaries, team, press, downloads] = await Promise.all([
    sanityFetch<Subsidiary[]>({ query: `*[_type == "subsidiary"]` }),
    sanityFetch<TeamMember[]>({ query: `*[_type == "teamMember"]` }),
    sanityFetch<PressRelease[]>({ query: `*[_type == "pressRelease"] | order(date desc)` }),
    sanityFetch<Download[]>({ query: `*[_type == "download"]` }),
  ]);

  const stats = [
    {
      label: "Subsidiaries",
      value: subsidiaries.length,
      icon: Building2,
      href: "/admin/editor/portfolio",
    },
    {
      label: "Team Members",
      value: team.length,
      icon: Users,
      href: "/admin/editor/about",
    },
    {
      label: "Press Releases",
      value: press.length,
      icon: Newspaper,
      href: "/admin/editor/news",
    },
    {
      label: "Downloads",
      value: downloads.length,
      icon: FileText,
      href: "/admin/editor/investors",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="font-heading text-3xl font-bold text-ink">
          Dashboard
        </h1>
        <p className="font-serif text-muted-foreground mt-2">
          Welcome to your dashboard. Here is an overview of your content.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="card-depth-1 transition-shadow duration-200 hover:shadow-paper">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-paper-shadow border border-border">
                  <stat.icon className="h-5 w-5 text-ink" />
                </div>
                <div>
                  <p className="font-heading text-2xl font-bold text-ink">
                    {stat.value}
                  </p>
                  <p className="label-uppercase">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Press Releases */}
      <div>
        <h2 className="font-heading text-xl font-bold text-ink mb-4 border-b border-hairline pb-2">
          Recent Press Releases
        </h2>
        {press.length > 0 ? (
          <div className="space-y-2">
            {press.slice(0, 5).map((r) => (
              <Card key={r._id} className="card-depth-1">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-serif font-bold text-ink">{r.title}</p>
                    <p className="label-uppercase">
                      {new Date(r.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="label-uppercase">{r.category}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground font-serif italic py-4">
            No press releases yet.
          </p>
        )}
      </div>

      {/* Recent Contact Messages */}
      <div>
        <h2 className="font-heading text-xl font-bold text-ink mb-4 border-b border-hairline pb-2">
          Contact Messages
        </h2>
        <p className="font-serif text-muted-foreground italic">
          Contact submissions are managed through the Formspree dashboard or the{" "}
          <Link href="/admin/messages" className="text-ink underline">
            Messages page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
