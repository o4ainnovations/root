import { sanityFetch, sanityClient } from "@/lib/sanity";
import { SubsidiaryCard } from "@/components/sections/subsidiary-card";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { buildMetadata, BreadcrumbSchema } from "@/lib/seo";
import type { Subsidiary, PageContent } from "@/types";

export async function generateMetadata() {
  const pageContent = await sanityClient.fetch<PageContent | null>(
    `*[_type == "pageContent" && slug.current == "portfolio"][0]{seo}`
  );
  return buildMetadata({
    title: pageContent?.seo?.metaTitle || "Portfolio",
    description: pageContent?.seo?.metaDescription || "Explore the companies, products, and projects in the O4A portfolio.",
    path: "/portfolio",
  });
}

const PORTFOLIO_QUERY = `*[_type == "subsidiary"] | order(order asc) {
  _id,
  name,
  slug,
  description,
  industry,
  url,
  logo,
  status,
  order
}`;

export default async function PortfolioPage() {
  const subsidiaries = await sanityFetch<Subsidiary[]>({
    query: PORTFOLIO_QUERY,
    tags: ["subsidiary"],
  });

  const pageContent = await sanityClient.fetch<PageContent | null>(
    `*[_type == "pageContent" && slug.current == "portfolio"][0]{body,seo}`
  );
  const b = (pageContent?.body as Record<string, unknown>) || {};

  const active = subsidiaries.filter((s) => s.status === "active");
  const upcoming = subsidiaries.filter((s) => s.status === "coming-soon");
  const past = subsidiaries.filter((s) => s.status === "past");

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Portfolio", href: "/portfolio" }]} />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <ScrollReveal>
        <div className="page-header">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink">
            Portfolio
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4 leading-relaxed max-w-2xl">
            {(b.introText as string) ||
              "O4A owns and operates a diverse portfolio of companies across multiple industries. Each subsidiary operates independently under the O4A umbrella."}
          </p>
        </div>
      </ScrollReveal>

      {active.length > 0 && (
        <section className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
            Active Companies
          </h2>
          <div className="space-y-6">
            {active.map((s) => (
              <ScrollReveal key={s._id}>
                <SubsidiaryCard subsidiary={s} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
            Coming Soon
          </h2>
          <div className="space-y-6">
            {upcoming.map((s) => (
              <ScrollReveal key={s._id}>
                <SubsidiaryCard subsidiary={s} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3 text-muted-foreground">
            Past Companies
          </h2>
          <div className="space-y-6 opacity-60">
            {past.map((s) => (
              <ScrollReveal key={s._id}>
                <SubsidiaryCard subsidiary={s} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {active.length === 0 && (
        <div className="text-center py-16">
          <p className="font-serif text-lg text-muted-foreground italic">
            Portfolio information is being prepared.
          </p>
        </div>
      )}
    </div>
    </>
  );
}
