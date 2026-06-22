import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Newspaper, Briefcase, Mail, Scale, Leaf, Home, ChevronRight } from "lucide-react";

const editors = [
  { href: "/admin/editor/home", label: "Homepage", description: "Company name, tagline, and navigation", icon: Home, route: "/" },
  { href: "/admin/editor/portfolio", label: "Portfolio", description: "Portfolio intro text and subsidiaries", icon: Building2, route: "/portfolio" },
  { href: "/admin/editor/about", label: "About", description: "Mission, timeline, and team members", icon: Users, route: "/about" },
  { href: "/admin/editor/investors", label: "Investor Relations", description: "Governance text, downloads, and contact", icon: Briefcase, route: "/investors" },
  { href: "/admin/editor/news", label: "Newsroom", description: "Intro text and press releases", icon: Newspaper, route: "/news" },
  { href: "/admin/editor/careers", label: "Careers", description: "Culture text, values, and job listings", icon: Briefcase, route: "/careers" },
  { href: "/admin/editor/contact", label: "Contact", description: "Contact emails and office information", icon: Mail, route: "/contact" },
  { href: "/admin/editor/legal", label: "Legal & Governance", description: "Privacy policy, terms, cookies, GDPR", icon: Scale, route: "/legal" },
  { href: "/admin/editor/esg", label: "ESG & Sustainability", description: "Environmental, social, and governance", icon: Leaf, route: "/esg" },
];

export default function EditorIndexPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="font-heading text-3xl font-bold text-ink">
          Content Editor
        </h1>
        <p className="font-serif text-muted-foreground mt-2">
          Select a page to edit its content. All changes are published immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {editors.map((editor) => (
          <Link key={editor.href} href={editor.href}>
            <Card className="card-depth-1 transition-shadow duration-200 hover:shadow-paper group cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-paper-shadow border border-border flex-shrink-0">
                  <editor.icon className="h-5 w-5 text-ink" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg font-bold text-ink">
                      {editor.label}
                    </h3>
                    <span className="label-uppercase text-[0.625rem] opacity-50">
                      {editor.route}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {editor.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-ink transition-colors flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
