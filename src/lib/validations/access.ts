import { z } from "zod";

export const addAuthorizedUserSchema = z.object({
  username: z.string().min(1, "Username is required").regex(/^[a-zA-Z0-9-]+$/, "Invalid GitHub username"),
  role: z.enum(["admin", "editor"]),
});

export const updateAuthorizedUserRoleSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["admin", "editor"]),
});

export type AddAuthorizedUser = z.infer<typeof addAuthorizedUserSchema>;
