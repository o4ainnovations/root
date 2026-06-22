import { z } from "zod";

export const uploadAssetSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  size: z.number().max(50 * 1024 * 1024, "File size must be under 50MB").optional(),
});

export type UploadAsset = z.infer<typeof uploadAssetSchema>;
