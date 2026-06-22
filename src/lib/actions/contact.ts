"use server";

import { sanityWriteClient } from "@/lib/sanity";
import { revalidateTag } from "next/cache";
import { submitContactFormSchema } from "@/lib/validations/contact";

export async function submitContactForm(data: {
  name: string;
  email: string;
  category: string;
  subject?: string;
  message: string;
}) {
  const parsed = submitContactFormSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }
  try {
    await sanityWriteClient.create({
      _type: "contactSubmission",
      name: parsed.data.name,
      email: parsed.data.email,
      category: parsed.data.category,
      subject: parsed.data.subject || "",
      message: parsed.data.message,
      read: false,
      archived: false,
    });
    revalidateTag("contactSubmission", "max");
  } catch (error) {
    console.error("Failed to submit contact form:", error);
    throw new Error("Failed to send message. Please try again.");
  }
}
