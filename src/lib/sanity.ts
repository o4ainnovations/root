import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
// Token for write operations via server actions.
// Must have Editor/Developer role (read+write) permissions in Sanity dashboard.
const writeToken =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;
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
  token: writeToken,
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
