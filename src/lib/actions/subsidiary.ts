"use server";

import { sanityWriteClient } from "@/lib/sanity";
import { requireAuth } from "@/lib/actions/guard";
import { revalidateTag } from "next/cache";
import { createSubsidiarySchema, updateSubsidiarySchema } from "@/lib/validations/subsidiary";

export async function createSubsidiary(data: {

  name: string;
  slug: string;
  description: string;
  industry: string;
  url?: string;
  status?: "active" | "coming-soon" | "past";
  order?: number;
}) {
  const parsed = createSubsidiarySchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  await requireAuth();
  try {
    await sanityWriteClient.create({
      _type: "subsidiary",
      name: parsed.data.name,
      slug: { _type: "slug", current: parsed.data.slug },
      description: parsed.data.description,
      industry: parsed.data.industry,
      url: parsed.data.url,
      status: parsed.data.status || "active",
      order: parsed.data.order || 0,
    });
    revalidateTag("subsidiary", "max");
  } catch (error) {
    console.error("Failed to create subsidiary:", error);
    throw new Error("Failed to create subsidiary. Please try again.");
  }
}

export async function updateSubsidiary(
  id: string,
  data: Partial<{

    name: string;
    slug: string;
    description: string;
    industry: string;
    url: string;
    status: "active" | "coming-soon" | "past";
    order: number;
  }>,
) {
  const parsed = updateSubsidiarySchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  const d = parsed.data;
  const patch: Record<string, unknown> = {};
  if (d.name !== undefined) patch.name = d.name;
  if (d.slug !== undefined) patch.slug = { _type: "slug", current: d.slug };
  if (d.description !== undefined) patch.description = d.description;
  if (d.industry !== undefined) patch.industry = d.industry;
  if (d.url !== undefined) patch.url = d.url;
  if (d.status !== undefined) patch.status = d.status;
  if (d.order !== undefined) patch.order = d.order;
  await requireAuth();
  try {
    await sanityWriteClient.patch(id).set(patch).commit();
    revalidateTag("subsidiary", "max");
  } catch (error) {
    console.error("Failed to update subsidiary:", error);
    throw new Error("Failed to update subsidiary. Please try again.");
  }
}

export async function deleteSubsidiary(id: string) {
  await requireAuth();
  try {
    await sanityWriteClient.delete(id);
    revalidateTag("subsidiary", "max");} catch (error) {
    console.error("Failed to delete subsidiary:", error);
    throw new Error("Failed to delete subsidiary. Please try again.");
  }
}
