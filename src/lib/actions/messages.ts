"use server";

import { sanityWriteClient } from "@/lib/sanity";
import { revalidateTag } from "next/cache";
import { requireAuth } from "@/lib/actions/guard";

export async function markMessageRead(id: string) {
  try {
    await requireAuth();
    await sanityWriteClient.patch(id).set({ read: true }).commit();
    revalidateTag("contactSubmission", "max");
  } catch (error) {
    console.error("Failed to mark message as read:", error);
    throw new Error("Failed to update message. Please try again.");
  }
}

export async function markMessageUnread(id: string) {
  try {
    await requireAuth();
    await sanityWriteClient.patch(id).set({ read: false }).commit();
    revalidateTag("contactSubmission", "max");
  } catch (error) {
    console.error("Failed to mark message as unread:", error);
    throw new Error("Failed to update message. Please try again.");
  }
}

export async function archiveMessage(id: string) {
  try {
    await requireAuth();
    await sanityWriteClient.patch(id).set({ archived: true }).commit();
    revalidateTag("contactSubmission", "max");
  } catch (error) {
    console.error("Failed to archive message:", error);
    throw new Error("Failed to archive message. Please try again.");
  }
}

export async function unarchiveMessage(id: string) {
  try {
    await requireAuth();
    await sanityWriteClient.patch(id).set({ archived: false }).commit();
    revalidateTag("contactSubmission", "max");
  } catch (error) {
    console.error("Failed to unarchive message:", error);
    throw new Error("Failed to update message. Please try again.");
  }
}

export async function addInternalNote(id: string, note: string) {
  try {
    await requireAuth();
    await sanityWriteClient.patch(id).set({ internalNotes: note }).commit();
    revalidateTag("contactSubmission", "max");
  } catch (error) {
    console.error("Failed to add internal note:", error);
    throw new Error("Failed to add note. Please try again.");
  }
}
