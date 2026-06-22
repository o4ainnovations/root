import { sanityFetch, sanityClient } from "@/lib/sanity";
import { PressList } from "@/components/sections/press-list";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { buildMetadata, BreadcrumbSchema } from "@/lib/seo";
import { COMPANY } from "@/lib/seo/constants";
import type { PressRelease } from "@/types";

export async function generateMetadata() {
  const pageContent = await sanityClient.fetch<{ seo?: { metaTitle?: string; metaDescription?: string } }>(
    `*[_type == "pageContent" && slug.current == "news"][0]{seo}`
  );
  return buildMetadata({
    title: pageContent?.seo?.metaTitle || "Newsroom",
    description:
      pageContent?.seo?.metaDescription || "Official press releases, announcements, and media resources from O4A.",
    path: "/news",
  });
}

const PRESS_QUERY = `*[_type == "pressRelease"] | order(date desc) {
  _id,
  title,
  slug,
  date,
  body,
  category,
  pdf,
  featured
}`;

export default async function NewsroomPage() {
  const pageContent = await sanityClient.fetch(
    '*[_type == "pageContent" && slug.current == "news"][0]{body,seo}'
  );
  const b = (pageContent?.body as Record<string, unknown>) || {};

  const releases = await sanityFetch<PressRelease[]>({
    query: PRESS_QUERY,
    tags: ["pressRelease"],
    revalidate: 300,
  });

  const years = Array.from(
    new Set(
      releases.map((r) => new Date(r.date).getFullYear().toString()),
    ),
  ).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Newsroom", href: "/news" }]} />
      <div className="mx-auto max-w-5xl px-6 py-16">
      <ScrollReveal>
        <div className="page-header">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink">
            Newsroom
          </h1>
          <p className="font-serif text-lg text-muted-foreground mt-4 leading-relaxed max-w-2xl">
            {(b.introText as string) || "Official press releases, announcements, and corporate news from O4A and its subsidiaries."}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <ScrollReveal>
            {releases.length > 0 ? (
              <PressList releases={releases} years={years} />
            ) : (
              <div className="text-center py-16">
                <p className="font-serif text-lg text-muted-foreground italic">
                  No press releases yet. Check back soon for company
                  announcements.
                </p>
              </div>
            )}
          </ScrollReveal>
        </div>

        <aside className="space-y-6">
          <div className="card-depth-1 p-6 sticky top-24">
            <h4 className="font-heading text-lg font-bold text-ink mb-4 border-b border-hairline pb-2">
              Media Contact
            </h4>
            <dl className="space-y-3">
              <div>
                <dt className="label-uppercase">Email</dt>
                <dd className="font-serif text-foreground">
                  {(b.mediaEmail as string) || COMPANY.contact.press}
                </dd>
              </div>
              <div>
                <dt className="label-uppercase mt-2">Response Time</dt>
                <dd className="font-serif text-foreground">
                  1 business day
                </dd>
              </div>
            </dl>
          </div>

          <div className="card-depth-1 p-6">
            <h4 className="font-heading text-lg font-bold text-ink mb-4 border-b border-hairline pb-2">
              Media Kit
            </h4>
            <p className="font-serif text-sm text-muted-foreground leading-relaxed">
              {(b.mediaKitText as string) || "Brand assets, executive photos, and boilerplate text are available upon request. Contact the press office for access."}
            </p>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}
