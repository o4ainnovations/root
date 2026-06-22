import { sanityFetch, sanityClient } from "@/lib/sanity";
import { DownloadList } from "@/components/sections/download-list";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { buildMetadata, BreadcrumbSchema } from "@/lib/seo";
import { COMPANY } from "@/lib/seo/constants";
import type { Download } from "@/types";

export async function generateMetadata() {
  const pageContent = await sanityClient.fetch<{ seo?: { metaTitle?: string; metaDescription?: string } }>(
    `*[_type == "pageContent" && slug.current == "investors"][0]{seo}`
  );
  return buildMetadata({
    title: pageContent?.seo?.metaTitle || "Investor Relations",
    description:
      pageContent?.seo?.metaDescription || "Investor information for O4A — governance, financials, and reports.",
    path: "/investors",
  });
}

const DOWNLOADS_QUERY = `*[_type == "download"] | order(publishDate desc) {
  _id,
  title,
  file,
  category,
  publishDate
}`;

export default async function InvestorsPage() {
  const pageContent = await sanityClient.fetch(
    '*[_type == "pageContent" && slug.current == "investors"][0]{body,seo}'
  );
  const b = (pageContent?.body as Record<string, unknown>) || {};

  const downloads = await sanityFetch<Download[]>({
    query: DOWNLOADS_QUERY,
    tags: ["download"],
  });

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Investor Relations", href: "/investors" }]} />
      <div className="mx-auto max-w-5xl px-6 py-16">
      <ScrollReveal>
        <div className="page-header">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink">
            Investor Relations
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4 leading-relaxed max-w-2xl">
            {(b.introText as string) || "O4A is a privately held company. We are committed to transparency and long-term value creation for all stakeholders."}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <ScrollReveal>
            <section>
              <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
                {(b.ownershipHeading as string) || "Ownership &amp; Structure"}
              </h2>
              <div className="space-y-4 font-serif text-lg leading-relaxed">
                <p style={{ whiteSpace: 'pre-line' }}>
                  {(b.ownershipBody as string) || `O4A is a privately held holding company. We are not publicly traded and do not offer securities to the public. Our capital comes from the founding team and strategic partnerships.

This structure allows us to make decisions based on long-term value creation rather than quarterly earnings pressure. We invest with a multi-decade time horizon.`}
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section>
              <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
                {(b.governanceHeading as string) || "Governance"}
              </h2>
              <div className="space-y-4 font-serif text-lg leading-relaxed">
                <p style={{ whiteSpace: 'pre-line' }}>
                  {(b.governanceBody as string) || `O4A is governed by its Board of Directors, which provides strategic oversight and ensures the company operates in accordance with its fiduciary duties and ethical standards.

Our governance framework includes regular board meetings, independent audit review, and transparent reporting to stakeholders. Governance documents are available for download.`}
                </p>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal>
            <section>
              <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
                {(b.financialHeading as string) || "Financial Overview"}
              </h2>
              <div className="space-y-4 font-serif text-lg leading-relaxed">
                <p style={{ whiteSpace: 'pre-line' }}>
                  {(b.financialBody as string) || `As a private company, O4A does not publicly disclose detailed financial statements. However, we provide periodic updates to stakeholders through our annual reports and press releases.

Our financial strategy prioritizes sustainable growth, operational efficiency, and reinvestment into our portfolio companies.`}
                </p>
              </div>
            </section>
          </ScrollReveal>
        </div>

        <aside className="space-y-6">
          <div className="card-depth-1 p-6 sticky top-24">
            <h4 className="font-heading text-lg font-bold text-ink mb-4 border-b border-hairline pb-2">
              Investor Contact
            </h4>
            <dl className="space-y-3">
              <div>
                <dt className="label-uppercase">Email</dt>
                <dd className="font-serif text-foreground">
                  {(b.investorEmail as string) || COMPANY.contact.investors}
                </dd>
              </div>
              <div>
                <dt className="label-uppercase mt-2">Response Time</dt>
                <dd className="font-serif text-foreground">
                  {(b.investorResponseTime as string) || "2 business days"}
                </dd>
              </div>
            </dl>
          </div>

          {downloads.length > 0 && (
            <div className="card-depth-1 p-6">
              <h4 className="font-heading text-lg font-bold text-ink mb-4 border-b border-hairline pb-2">
                Downloads
              </h4>
              <DownloadList downloads={downloads} />
            </div>
          )}
        </aside>
      </div>
    </div>
    </>
  );
}
