"use server";

import { sanityWriteClient } from "@/lib/sanity";
import { requireAuth } from "@/lib/actions/guard";
import { uploadAssetSchema } from "@/lib/validations/media";

export async function uploadAsset(file: File, filename: string) {
  const parsed = uploadAssetSchema.safeParse({ filename, size: file.size });
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  try {
    await requireAuth();
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await sanityWriteClient.assets.upload("file", buffer, {
      filename,
    });
    return { _id: asset._id, url: asset.url };
  } catch (error) {
    console.error("Failed to upload asset:", error);
    throw new Error("Failed to upload file. Please try again.");
  }
}

export async function deleteAsset(id: string) {
  await requireAuth();
  try {
    await sanityWriteClient.delete(id);
  } catch (error) {
    console.error("Failed to delete asset:", error);
    throw new Error("Failed to delete asset. Please try again.");
  }
}
