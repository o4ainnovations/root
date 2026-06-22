"use server";

import { sanityWriteClient } from "@/lib/sanity";
import { requireAuth } from "@/lib/actions/guard";
import { revalidateTag } from "next/cache";
import { createPageSchema, updatePageSchema } from "@/lib/validations/page-content";

export async function createPage(data: {

  title: string;
  slug: string;
  body?: unknown;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    noindex?: boolean;
  };
}) {
  const parsed = createPageSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  await requireAuth();
  try {
    await sanityWriteClient.create({
      _type: "pageContent",
      title: data.title,
      slug: { _type: "slug", current: data.slug },
      body: data.body,
      seo: data.seo,
      lastUpdated: new Date().toISOString(),
    });
    revalidateTag("pageContent", "max");
  } catch (error) {
    console.error("Failed to create page:", error);
    throw new Error("Failed to create page. Please try again.");
  }
}

export async function updatePage(
  id: string,
  data: Partial<{

    title: string;
    body: unknown;
    seo: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
      noindex?: boolean;
    };
  }>,
) {
  const parsed = updatePageSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  const patch: Record<string, unknown> = { lastUpdated: new Date().toISOString() };
  if (parsed.data.title !== undefined) patch.title = parsed.data.title;
  if (parsed.data.body !== undefined) patch.body = parsed.data.body;
  if (parsed.data.seo !== undefined) patch.seo = parsed.data.seo;
  await requireAuth();
  try {
    await sanityWriteClient.patch(id).set(patch).commit();
    revalidateTag("pageContent", "max");
  } catch (error) {
    console.error("Failed to update page:", error);
    throw new Error("Failed to update page. Please try again.");
  }
}

export async function deletePage(id: string) {
  await requireAuth();
  try {
    await sanityWriteClient.delete(id);
    revalidateTag("pageContent", "max");} catch (error) {
    console.error("Failed to delete page:", error);
    throw new Error("Failed to delete page. Please try again.");
  }
}
