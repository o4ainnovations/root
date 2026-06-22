"use server";

import { sanityWriteClient } from "@/lib/sanity";
import { requireAuth } from "@/lib/actions/guard";
import { revalidateTag } from "next/cache";
import { createJobSchema, updateJobSchema } from "@/lib/validations/job";

export async function createJob(data: {

  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType?: "full-time" | "part-time" | "contract" | "internship";
  subsidiary?: string;
  description: string;
  applyUrl?: string;
}) {
  const parsed = createJobSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  await requireAuth();
  try {
    await sanityWriteClient.create({
      _type: "job",
      title: parsed.data.title,
      slug: { _type: "slug", current: parsed.data.slug },
      department: parsed.data.department,
      location: parsed.data.location,
      employmentType: parsed.data.employmentType || "full-time",
      subsidiary: parsed.data.subsidiary,
      description: parsed.data.description,
      applyUrl: parsed.data.applyUrl,
      active: true,
      postedDate: new Date().toISOString(),
    });
    revalidateTag("job", "max");
  } catch (error) {
    console.error("Failed to create job:", error);
    throw new Error("Failed to create job. Please try again.");
  }
}

export async function updateJob(
  id: string,
  data: Partial<{

    title: string;
    slug: string;
    department: string;
    location: string;
    employmentType: "full-time" | "part-time" | "contract" | "internship";
    subsidiary: string;
    description: string;
    applyUrl: string;
    active: boolean;
  }>,
) {
  const parsed = updateJobSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  const d = parsed.data;
  const patch: Record<string, unknown> = {};
  if (d.title !== undefined) patch.title = d.title;
  if (d.slug !== undefined) patch.slug = { _type: "slug", current: d.slug };
  if (d.department !== undefined) patch.department = d.department;
  if (d.location !== undefined) patch.location = d.location;
  if (d.employmentType !== undefined) patch.employmentType = d.employmentType;
  if (d.subsidiary !== undefined) patch.subsidiary = d.subsidiary;
  if (d.description !== undefined) patch.description = d.description;
  if (d.applyUrl !== undefined) patch.applyUrl = d.applyUrl;
  if (d.active !== undefined) patch.active = d.active;
  await requireAuth();
  try {
    await sanityWriteClient.patch(id).set(patch).commit();
    revalidateTag("job", "max");
  } catch (error) {
    console.error("Failed to update job:", error);
    throw new Error("Failed to update job. Please try again.");
  }
}

export async function deleteJob(id: string) {
  await requireAuth();
  try {
    await sanityWriteClient.delete(id);
    revalidateTag("job", "max");} catch (error) {
    console.error("Failed to delete job:", error);
    throw new Error("Failed to delete job. Please try again.");
  }
}
