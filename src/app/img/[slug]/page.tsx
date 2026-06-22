import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/animations/fade-in";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return buildMetadata({
    title: `Image — ${slug}`,
    description: `Viewing image: ${slug}`,
    path: `/img/${slug}`,
    robots: { index: false, follow: false },
  });
}

export default async function ImagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16">
      <FadeIn>
        <div className="max-w-4xl w-full">
          <div className="card-depth-2 overflow-hidden relative aspect-video">
            <Image
              src={`/api/media/img/${slug}`}
              alt={slug}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <p className="label-uppercase mt-4 text-center">
            /img/{slug}
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
