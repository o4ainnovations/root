import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase, alphanumeric with hyphens"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship"]).optional(),
  subsidiary: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  applyUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  active: z.boolean().optional(),
});

export const updateJobSchema = createJobSchema.partial();
export type CreateJob = z.infer<typeof createJobSchema>;
export type UpdateJob = z.infer<typeof updateJobSchema>;
