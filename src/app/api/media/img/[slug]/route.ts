import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const asset = await sanityClient.fetch<{ url: string } | null>(
      `*[_type == "sanity.imageAsset" && originalFilename == $slug][0]{url}`,
      { slug },
    );

    if (!asset?.url) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const imageResponse = await fetch(asset.url);
    const buffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get("content-type") || "image/png";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Image not found", { status: 404 });
  }
}
