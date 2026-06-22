import { sanityClient } from "@/lib/sanity";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { buildMetadata, BreadcrumbSchema } from "@/lib/seo";
import type { PageContent } from "@/types";

const FALLBACK_COMMITMENT = [
  "At O4A, we believe that long-term value creation depends on responsible business practices. Our approach to ESG is integrated into our investment decisions, operational management, and corporate governance.",
  "We are a young company actively building our ESG framework. As we grow, we will set measurable targets, publish annual reports, and hold ourselves accountable to stakeholders.",
];

const FALLBACK_ENV =
  "Our portfolio companies are encouraged to operate sustainably. We consider environmental impact when evaluating new investments and prioritize resource efficiency.";

const FALLBACK_SOCIAL =
  "We are committed to fostering diverse, inclusive workplaces across our portfolio. We believe that exceptional talent comes from all backgrounds, and we seek to create environments where everyone can thrive.";

const FALLBACK_GOV =
  "Strong governance is the foundation of O4A. Our board oversees ESG strategy, risk management, and ethical conduct. We maintain transparent policies and comply with all applicable laws and regulations.";

export async function generateMetadata() {
  const pageContent = await sanityClient.fetch<PageContent | null>(
    `*[_type == "pageContent" && slug.current == "esg"][0]{body,seo}`
  );
  return buildMetadata({
    title: pageContent?.seo?.metaTitle || "ESG & Sustainability",
    description:
      pageContent?.seo?.metaDescription ||
      "Environmental, social, and governance commitments and initiatives at O4A.",
    path: "/esg",
  });
}

export default async function ESGPage() {
  const pageContent = await sanityClient.fetch<PageContent | null>(
    `*[_type == "pageContent" && slug.current == "esg"][0]{body,seo}`
  );
  const b = (pageContent?.body as Record<string, unknown>) || {};

  const commitmentParas = ((b.commitmentText as string) || "")
    .split("\n\n")
    .filter(Boolean);
  const commitment =
    commitmentParas.length > 0 ? commitmentParas : FALLBACK_COMMITMENT;

  return (
    <>
      <BreadcrumbSchema items={[{ name: "ESG & Sustainability", href: "/esg" }]} />
      <div className="mx-auto max-w-3xl px-6 py-16">
      <ScrollReveal>
        <div className="page-header">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink">
            ESG &amp; Sustainability
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4 leading-relaxed">
            Our commitment to responsible business practices across
            environmental, social, and governance dimensions.
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-16">
        <ScrollReveal>
          <section>
            <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
              Our Commitment
            </h2>
            <div className="drop-cap font-serif text-lg leading-relaxed space-y-4">
              {commitment.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section>
            <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
              Environmental
            </h2>
            <div className="space-y-4 font-serif text-lg leading-relaxed">
              <p>{(b.envText as string) || FALLBACK_ENV}</p>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section>
            <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
              Social
            </h2>
            <div className="space-y-4 font-serif text-lg leading-relaxed">
              <p>{(b.socialText as string) || FALLBACK_SOCIAL}</p>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section>
            <h2 className="font-heading text-2xl font-bold text-ink mb-6 border-b border-hairline pb-3">
              Governance
            </h2>
            <div className="space-y-4 font-serif text-lg leading-relaxed">
              <p>{(b.govText as string) || FALLBACK_GOV}</p>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
    </>
  );
}
