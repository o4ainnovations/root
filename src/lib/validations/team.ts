import { z } from "zod";

export const createTeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().optional(),
  type: z.enum(["executive", "board"]).optional(),
  order: z.number().optional(),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();
export type CreateTeamMember = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMember = z.infer<typeof updateTeamMemberSchema>;
