import { z } from "zod";

export const submitContactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Must be a valid email address"),
  category: z.enum(["general", "media", "investor", "partnership", "legal"]),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export type SubmitContactForm = z.infer<typeof submitContactFormSchema>;
