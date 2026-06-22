import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const asset = await sanityClient.fetch<{ url: string } | null>(
      `*[_type == "sanity.fileAsset" && originalFilename == $slug][0]{url}`,
      { slug },
    );

    if (!asset?.url) {
      return new NextResponse("Video not found", { status: 404 });
    }

    const res = await fetch(asset.url);
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "video/mp4";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    return new NextResponse("Video not found", { status: 404 });
  }
}
