import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { sanityClient, urlFor } from "@/lib/sanity";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/animations/fade-in";
import { BreadcrumbSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { Subsidiary } from "@/types";

const SUBSIDIARY_QUERY = `*[_type == "subsidiary" && slug.current == $slug][0] {
  _id,
  name,
  description,
  industry,
  url,
  logo,
  status,
  order
}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const subsidiary = await sanityClient.fetch<Subsidiary | null>(
    SUBSIDIARY_QUERY,
    { slug },
  );
  if (!subsidiary) return { title: "Not Found" };

  return buildMetadata({
    title: subsidiary.name,
    description: subsidiary.description,
    path: `/portfolio/${slug}`,
  });
}

export default async function SubsidiaryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subsidiary = await sanityClient.fetch<Subsidiary | null>(
    SUBSIDIARY_QUERY,
    { slug },
  );

  if (!subsidiary) notFound();

  const isActive = subsidiary.status === "active";

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Portfolio", href: "/portfolio" }, { name: subsidiary.name, href: "" }]} />
      <div className="mx-auto max-w-3xl px-6 py-16">
      <FadeIn>
        <div className="page-header">
          <div className="flex items-center gap-3 mb-4">
            <Badge
              variant="outline"
              className={cn(
                "rounded-none font-sans uppercase text-[0.625rem] tracking-wider border-ink text-ink",
                subsidiary.status === "coming-soon" &&
                  "border-border text-muted-foreground",
                subsidiary.status === "past" &&
                  "border-border text-muted-foreground opacity-50",
              )}
            >
              {subsidiary.status === "active" && "Active"}
              {subsidiary.status === "coming-soon" && "Coming Soon"}
              {subsidiary.status === "past" && "Past"}
            </Badge>
            <span className="label-uppercase">{subsidiary.industry}</span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-ink mb-4">
            {subsidiary.name}
          </h1>
        </div>
      </FadeIn>

      {subsidiary.logo && (
        <FadeIn delay={0.1}>
          <div className="my-8 flex justify-center">
            <div className="relative w-48 h-24 border border-border p-8">
              <Image
                src={urlFor(subsidiary.logo).width(200).url()}
                alt={subsidiary.name}
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
          </div>
        </FadeIn>
      )}

      <Separator className="my-8 bg-hairline" />

      <FadeIn delay={0.1}>
        <div className="drop-cap font-serif text-lg leading-relaxed whitespace-pre-line">
          {subsidiary.description}
        </div>
      </FadeIn>

      {subsidiary.url && isActive && (
        <FadeIn delay={0.2}>
          <div className="mt-8">
            <a
              href={subsidiary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link bg-ink text-background px-6 py-3 inline-block"
            >
              Visit Website &rarr;
            </a>
          </div>
        </FadeIn>
      )}
    </div>
    </>
  );
}
