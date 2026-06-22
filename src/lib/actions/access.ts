"use server";

import { sanityWriteClient } from "@/lib/sanity";
import { requireAuth } from "@/lib/actions/guard";
import { revalidateTag } from "next/cache";
import { addAuthorizedUserSchema, updateAuthorizedUserRoleSchema } from "@/lib/validations/access";

export async function addAuthorizedUser(username: string, role: "admin" | "editor") {
  const parsed = addAuthorizedUserSchema.safeParse({ username, role });
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  try {
    await requireAuth();
    await sanityWriteClient.create({
      _type: "authorizedUser",
      username: parsed.data.username,
      role: parsed.data.role,
      active: true,
    });
    revalidateTag("authorizedUser", "max");
  } catch (error) {
    console.error("Failed to add authorized user:", error);
    throw new Error("Failed to add user. Please try again.");
  }
}

export async function removeAuthorizedUser(id: string) {
  try {
    await requireAuth();
    await sanityWriteClient.delete(id);
    revalidateTag("authorizedUser", "max");
  } catch (error) {
    console.error("Failed to remove authorized user:", error);
    throw new Error("Failed to remove user. Please try again.");
  }
}

export async function updateAuthorizedUserRole(id: string, role: "admin" | "editor") {
  const parsed = updateAuthorizedUserRoleSchema.safeParse({ id, role });
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  try {
    await requireAuth();
    await sanityWriteClient.patch(id).set({ role: parsed.data.role }).commit();
    revalidateTag("authorizedUser", "max");
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw new Error("Failed to update role. Please try again.");
  }
}
