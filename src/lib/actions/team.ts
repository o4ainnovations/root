"use server";

import { sanityWriteClient } from "@/lib/sanity";
import { requireAuth } from "@/lib/actions/guard";
import { revalidateTag } from "next/cache";
import { createTeamMemberSchema, updateTeamMemberSchema } from "@/lib/validations/team";

export async function createTeamMember(data: {

  name: string;
  title: string;
  bio?: string;
  type?: "executive" | "board";
  order?: number;
}) {
  const parsed = createTeamMemberSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  await requireAuth();
  try {
    await sanityWriteClient.create({
      _type: "teamMember",
      name: parsed.data.name,
      title: parsed.data.title,
      bio: parsed.data.bio || "",
      type: parsed.data.type || "executive",
      order: parsed.data.order || 0,
    });
    revalidateTag("teamMember", "max");
  } catch (error) {
    console.error("Failed to create team member:", error);
    throw new Error("Failed to create team member. Please try again.");
  }
}

export async function updateTeamMember(
  id: string,
  data: Partial<{

    name: string;
    title: string;
    bio: string;
    type: "executive" | "board";
    order: number;
  }>,
) {
  const parsed = updateTeamMemberSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  const d = parsed.data;
  const patch: Record<string, unknown> = {};
  if (d.name !== undefined) patch.name = d.name;
  if (d.title !== undefined) patch.title = d.title;
  if (d.bio !== undefined) patch.bio = d.bio;
  if (d.type !== undefined) patch.type = d.type;
  if (d.order !== undefined) patch.order = d.order;
  await requireAuth();
  try {
    await sanityWriteClient.patch(id).set(patch).commit();
    revalidateTag("teamMember", "max");
  } catch (error) {
    console.error("Failed to update team member:", error);
    throw new Error("Failed to update team member. Please try again.");
  }
}

export async function deleteTeamMember(id: string) {
  await requireAuth();
  try {
    await sanityWriteClient.delete(id);
    revalidateTag("teamMember", "max");} catch (error) {
    console.error("Failed to delete team member:", error);
    throw new Error("Failed to delete team member. Please try again.");
  }
}
