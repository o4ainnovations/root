import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import { buildMetadata, JsonLd, buildCorporationSchema, buildWebSiteSchema, BreadcrumbSchema } from "@/lib/seo";
import type { PageContent } from "@/types";

export async function generateMetadata() {
  const pageContent = await sanityClient.fetch<PageContent | null>(
    `*[_type == "pageContent" && slug.current == "home"][0]{body,seo}`
  );
  return buildMetadata({
    title: pageContent?.seo?.metaTitle || "Home",
    description:
      pageContent?.seo?.metaDescription ||
      "O4A is a holding company that builds, operates, and invests in companies, products, and projects.",
    path: "/",
  });
}

export default async function HomePage() {
  const pageContent = await sanityClient.fetch<PageContent | null>(
    `*[_type == "pageContent" && slug.current == "home"][0]{body,seo}`
  );
  const b = (pageContent?.body as Record<string, unknown>) || {};

  const navLinks = [
    { href: "/portfolio", label: (b.portfolioLabel as string) || "Portfolio" },
    { href: "/about", label: (b.aboutLabel as string) || "About O4A" },
    { href: "/investors", label: (b.investorsLabel as string) || "Investor Relations" },
    { href: "/news", label: (b.newsLabel as string) || "Newsroom" },
    { href: "/careers", label: (b.careersLabel as string) || "Careers" },
    { href: "/contact", label: (b.contactLabel as string) || "Contact" },
  ];

  const companyName = (b.companyName as string) || "O4A";

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }]} />
      <JsonLd data={buildCorporationSchema()} id="corporation" />
      <JsonLd data={buildWebSiteSchema()} id="website" />
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-6">
      <div className="border-2 border-solid border-border p-12 md:p-16 lg:p-20 w-full max-w-lg text-center">
        <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold text-ink tracking-tight">
          {companyName}
        </h1>

        <hr className="border-t border-border my-8" />

        <p className="font-serif text-lg text-muted-foreground mb-10 leading-relaxed">
          {(b.tagline as string) || "A holding company. Building and operating businesses."}
        </p>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-[0.75rem]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <footer className="mt-12 text-center">
        <p className="label-uppercase text-[0.625rem]">
          &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
        </p>
      </footer>
    </div>
    </>
  );
}
