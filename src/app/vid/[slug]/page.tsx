import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/animations/fade-in";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return buildMetadata({
    title: `Video — ${slug}`,
    description: `Viewing video: ${slug}`,
    path: `/vid/${slug}`,
    robots: { index: false, follow: false },
  });
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16">
      <FadeIn>
        <div className="max-w-4xl w-full">
          <div className="card-depth-2 overflow-hidden">
            <video
              controls
              className="w-full h-auto"
              src={`/api/media/vid/${slug}`}
            >
              Your browser does not support video playback.
            </video>
          </div>
          <p className="label-uppercase mt-4 text-center">
            /vid/{slug}
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
