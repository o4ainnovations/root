import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/animations/fade-in";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return buildMetadata({
    title: `Document — ${slug}`,
    description: `Viewing document: ${slug}`,
    path: `/doc/${slug}`,
    robots: { index: false, follow: false },
  });
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16">
      <FadeIn>
        <div className="max-w-2xl w-full">
          <div className="card-depth-2 p-10 text-center">
            <h1 className="font-heading text-2xl font-bold text-ink mb-4">
              Document
            </h1>
            <hr className="border-hairline my-4 w-16 mx-auto" />
            <p className="font-serif text-muted-foreground leading-relaxed mb-6">
              This document is hosted at <code className="font-mono text-sm text-ink">/doc/{slug}</code>.
            </p>
            <a
              href={`/api/media/doc/${slug}`}
              className="nav-link bg-ink text-background px-6 py-3 inline-block"
              download
            >
              Download
            </a>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
