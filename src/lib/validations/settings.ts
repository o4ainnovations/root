import { z } from "zod";

export const updateSiteSettingsSchema = z.object({
  companyName: z.string().optional(),
  legalName: z.string().optional(),
  shortTagline: z.string().optional(),
  fullTagline: z.string().optional(),
  description: z.string().optional(),
  foundingDate: z.string().optional(),
  addressCountry: z.string().optional(),
  contactGeneral: z.string().optional(),
  contactPress: z.string().optional(),
  contactInvestors: z.string().optional(),
  contactPartnerships: z.string().optional(),
  socialTwitter: z.string().optional(),
  socialLinkedIn: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  socialGitHub: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  defaultMetaTitle: z.string().optional(),
  defaultMetaDescription: z.string().optional(),
  googleVerification: z.string().optional(),
  gaId: z.string().optional(),
});

export type UpdateSiteSettings = z.infer<typeof updateSiteSettingsSchema>;
