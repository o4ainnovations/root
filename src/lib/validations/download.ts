import { z } from "zod";

export const createDownloadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fileAssetId: z.string().optional(),
  category: z.enum(["investor", "esg", "governance"]).optional(),
});

export const updateDownloadSchema = createDownloadSchema.partial();

export type CreateDownload = z.infer<typeof createDownloadSchema>;
export type UpdateDownload = z.infer<typeof updateDownloadSchema>;
