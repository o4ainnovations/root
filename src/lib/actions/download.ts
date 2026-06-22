"use server";

import { sanityWriteClient } from "@/lib/sanity";
import { requireAuth } from "@/lib/actions/guard";
import { revalidateTag } from "next/cache";
import { createDownloadSchema, updateDownloadSchema } from "@/lib/validations/download";

export async function createDownload(data: {

  title: string;
  fileAssetId?: string;
  category?: "investor" | "esg" | "governance";
}) {
  const parsed = createDownloadSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  await requireAuth();
  try {
    const doc: Record<string, unknown> = {
      _type: "download",
      title: data.title,
      category: data.category || "investor",
      publishDate: new Date().toISOString(),
    };
    if (data.fileAssetId) {
      doc.file = {
        _type: "file",
        asset: { _type: "reference", _ref: data.fileAssetId },
      };
    }
    await sanityWriteClient.create(doc as Record<string, unknown> & { _type: string });
    revalidateTag("download", "max");
  } catch (error) {
    console.error("Failed to create download:", error);
    throw new Error("Failed to create download. Please try again.");
  }
}

export async function updateDownload(
  id: string,
  data: Partial<{

    title: string;
    category: "investor" | "esg" | "governance";
  }>,
) {
  const parsed = updateDownloadSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  const patch: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) patch.title = parsed.data.title;
  if (parsed.data.category !== undefined) patch.category = parsed.data.category;
  await requireAuth();
  try {
    await sanityWriteClient.patch(id).set(patch).commit();
    revalidateTag("download", "max");
  } catch (error) {
    console.error("Failed to update download:", error);
    throw new Error("Failed to update download. Please try again.");
  }
}

export async function deleteDownload(id: string) {
  await requireAuth();
  try {
    await sanityWriteClient.delete(id);
    revalidateTag("download", "max");
  } catch (error) {
    console.error("Failed to delete download:", error);
    throw new Error("Failed to delete download. Please try again.");
  }
}
