import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityClient, urlFor } from "@/lib/sanity";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PortableText } from "@/components/blog/post-body";
import { FadeIn } from "@/components/animations/fade-in";
import { JsonLd, buildNewsArticleSchema, BreadcrumbSchema, buildMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/seo/constants";
import type { PressRelease } from "@/types";

const PRESS_QUERY = `*[_type == "pressRelease" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  date,
  body,
  category,
  featured,
  pdf
}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const release = await sanityClient.fetch<PressRelease | null>(PRESS_QUERY, {
    slug,
  });
  if (!release) return { title: "Not Found" };

  return buildMetadata({
    title: release.title,
    description: `Press release — ${release.title}`,
    path: `/news/${release.slug}`,
    ogType: "article",
    article: { publishedTime: release.date },
  });
}

export const revalidate = 300;

export default async function PressReleasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const release = await sanityClient.fetch<PressRelease | null>(PRESS_QUERY, {
    slug,
  });

  if (!release) notFound();

  const date = new Date(release.date);
  const categoryLabels: Record<string, string> = {
    corporate: "Corporate",
    product: "Product",
    partnership: "Partnership",
  };

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Newsroom", href: "/news" }, { name: release.title, href: "" }]} />
      <JsonLd data={buildNewsArticleSchema({
        headline: release.title,
        url: `${COMPANY.url}/news/${slug}`,
        imageUrl: COMPANY.ogImage.url,
        datePublished: release.date,
      })} id="article" />
      <div className="mx-auto max-w-3xl px-6 py-16">
      <FadeIn>
        <div className="page-header">
          <div className="flex items-center gap-3 mb-4">
            <Badge
              variant="outline"
              className="rounded-none font-sans uppercase text-[0.625rem] tracking-wider border-ink text-ink"
            >
              {categoryLabels[release.category] || release.category}
            </Badge>
            {release.featured && (
              <Badge
                variant="outline"
                className="rounded-none font-sans uppercase text-[0.625rem] tracking-wider border-gold text-gold bg-gold/10"
              >
                Featured
              </Badge>
            )}
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink mb-4">
            {release.title}
          </h1>

          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </FadeIn>

      <Separator className="my-8 bg-hairline" />

      <FadeIn delay={0.1}>
        <div className="drop-cap font-serif text-lg leading-relaxed prose prose-ink">
          <PortableText value={release.body} />
        </div>
      </FadeIn>

      {release.pdf?.asset?._ref && (
        <FadeIn delay={0.2}>
          <div className="mt-12 pt-8 border-t border-hairline">
            <p className="label-uppercase mb-2">Download</p>
            <a
              href={urlFor(release.pdf).url()}
              className="text-ink hover:text-gold transition-colors font-serif underline underline-offset-2"
            >
              Download PDF
            </a>
          </div>
        </FadeIn>
      )}
    </div>
    </>
  );
}
