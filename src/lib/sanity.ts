import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
// Token for write operations via server actions.
// IMPORTANT: Must have Editor/Developer role write permissions in Sanity dashboard.
// If using a read-only token, all admin create/update/delete will fail at runtime.
// Consider creating a dedicated SANITY_API_WRITE_TOKEN with write permissions
// and using it here instead of reusing the read token.
const token = process.env.SANITY_API_READ_TOKEN;
const apiVersion = "2024-01-01";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: { enabled: false },
});

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  stega: { enabled: false },
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

export async function sanityFetch<T>({
  query,
  tags,
  revalidate,
}: {
  query: string;
  tags?: string[];
  revalidate?: number;
}): Promise<T> {
  try {
    const result = await sanityClient.fetch<T>(
      query,
      {},
      {
        cache: revalidate ? undefined : "force-cache",
        next: { tags, revalidate },
      },
    );
    return result;
  } catch (error) {
    console.error(`Sanity fetch error for query [${query.slice(0, 100)}...]:`, error);
    return [] as unknown as T;
  }
}
