"use server";

import { sanityWriteClient } from "@/lib/sanity";
import { requireAuth } from "@/lib/actions/guard";
import { revalidateTag } from "next/cache";
import { createPressReleaseSchema, updatePressReleaseSchema } from "@/lib/validations/press";

export async function createPressRelease(data: {

  title: string;
  slug: string;
  date?: string;
  body?: unknown;
  category?: "corporate" | "product" | "partnership";
  featured?: boolean;
}) {
  const parsed = createPressReleaseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  await requireAuth();
  try {
    await sanityWriteClient.create({
      _type: "pressRelease",
      title: parsed.data.title,
      slug: { _type: "slug", current: parsed.data.slug },
      date: parsed.data.date || new Date().toISOString(),
      body: parsed.data.body,
      category: parsed.data.category || "corporate",
      featured: parsed.data.featured || false,
    });
    revalidateTag("pressRelease", "max");
  } catch (error) {
    console.error("Failed to create press release:", error);
    throw new Error("Failed to create press release. Please try again.");
  }
}

export async function updatePressRelease(
  id: string,
  data: Partial<{

    title: string;
    slug: string;
    date: string;
    body: unknown;
    category: "corporate" | "product" | "partnership";
    featured: boolean;
  }>,
) {
  const parsed = updatePressReleaseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  const d = parsed.data;
  const patch: Record<string, unknown> = {};
  if (d.title !== undefined) patch.title = d.title;
  if (d.slug !== undefined) patch.slug = { _type: "slug", current: d.slug };
  if (d.date !== undefined) patch.date = d.date;
  if (d.body !== undefined) patch.body = d.body;
  if (d.category !== undefined) patch.category = d.category;
  if (d.featured !== undefined) patch.featured = d.featured;
  await requireAuth();
  try {
    await sanityWriteClient.patch(id).set(patch).commit();
    revalidateTag("pressRelease", "max");
  } catch (error) {
    console.error("Failed to update press release:", error);
    throw new Error("Failed to update press release. Please try again.");
  }
}

export async function deletePressRelease(id: string) {
  await requireAuth();
  try {
    await sanityWriteClient.delete(id);
    revalidateTag("pressRelease", "max");} catch (error) {
    console.error("Failed to delete press release:", error);
    throw new Error("Failed to delete press release. Please try again.");
  }
}
