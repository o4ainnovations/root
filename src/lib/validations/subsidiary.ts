import { z } from "zod";

export const createSubsidiarySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase, alphanumeric with hyphens"),
  description: z.string().min(1, "Description is required"),
  industry: z.string().min(1, "Industry is required"),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["active", "coming-soon", "past"]).optional(),
  order: z.number().optional(),
});

export const updateSubsidiarySchema = createSubsidiarySchema.partial();
export type CreateSubsidiary = z.infer<typeof createSubsidiarySchema>;
export type UpdateSubsidiary = z.infer<typeof updateSubsidiarySchema>;
