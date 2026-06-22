"use server";

import { sanityWriteClient } from "@/lib/sanity";
import { requireAuth } from "@/lib/actions/guard";
import { revalidateTag } from "next/cache";
import { updateSiteSettingsSchema } from "@/lib/validations/settings";

export async function updateSiteSettings(
  id: string,
  data: Record<string, unknown>,
) {

  const parsed = updateSiteSettingsSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  await requireAuth();
  try {
    await sanityWriteClient.patch(id).set(parsed.data).commit();
    revalidateTag("siteSettings", "max");
  } catch (error) {
    console.error("Failed to update site settings:", error);
    throw new Error("Failed to update settings. Please try again.");
  }
}

export async function createSiteSettings(data: Record<string, unknown>) {

  const parsed = updateSiteSettingsSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  await requireAuth();
  try {
    await sanityWriteClient.create({
      _type: "siteSettings",
      title: "O4A Site Settings",
      ...parsed.data,
    });
    revalidateTag("siteSettings", "max");
  } catch (error) {
    console.error("Failed to create site settings:", error);
    throw new Error("Failed to create settings. Please try again.");
  }
}
