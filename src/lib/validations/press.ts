import { z } from "zod";

export const createPressReleaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase, alphanumeric with hyphens"),
  date: z.string().optional(),
  body: z.unknown().optional(),
  category: z.enum(["corporate", "product", "partnership"]).optional(),
  featured: z.boolean().optional(),
});

export const updatePressReleaseSchema = createPressReleaseSchema.partial();
export type CreatePressRelease = z.infer<typeof createPressReleaseSchema>;
export type UpdatePressRelease = z.infer<typeof updatePressReleaseSchema>;
