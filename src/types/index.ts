export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: {
    asset: { _ref: string };
  };
  keywords?: string[];
  noindex?: boolean;
}

export interface Subsidiary {
  _id: string;
  _updatedAt?: string;
  name: string;
  slug: { current: string };
  description: string;
  industry: string;
  url?: string;
  logo?: {
    asset: { _ref: string };
  };
  status: "active" | "coming-soon" | "past";
  order: number;
  seo?: SeoFields;
}

export interface TeamMember {
  _id: string;
  _updatedAt?: string;
  name: string;
  title: string;
  bio: string;
  photo?: {
    asset: { _ref: string };
  };
  type: "executive" | "board";
  order: number;
  seo?: SeoFields;
}

export interface PressRelease {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: { current: string };
  date: string;
  body: unknown;
  category: "corporate" | "product" | "partnership";
  pdf?: {
    asset: { _ref: string };
  };
  featured: boolean;
  seo?: SeoFields;
}

export interface Download {
  _id: string;
  title: string;
  file: {
    asset: { _ref: string; url: string };
  };
  category: "investor" | "esg" | "governance";
  publishDate: string;
  seo?: SeoFields;
}

export interface PageContent {
  _id: string;
  title: string;
  slug: { current: string };
  body: unknown;
  lastUpdated: string;
  seo?: SeoFields;
}

export interface Job {
  _id: string;
  title: string;
  slug: { current: string };
  department: string;
  location: string;
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  subsidiary: string;
  description: string;
  applyUrl?: string;
  seo?: SeoFields;
  active: boolean;
  postedDate: string;
}

export interface ContactSubmission {
  _id: string;
  _createdAt?: string;
  name: string;
  email: string;
  category: "general" | "media" | "investor" | "partnership" | "legal";
  subject?: string;
  message: string;
  attachments?: {
    asset: { _ref: string; url: string };
  }[];
  read: boolean;
  archived: boolean;
  internalNotes?: string;
}

export interface SiteSettings {
  _id: string;
  companyName?: string;
  legalName?: string;
  shortTagline?: string;
  fullTagline?: string;
  description?: string;
  foundingDate?: string;
  addressCountry?: string;
  logo?: { asset: { _ref: string } };
  ogImage?: { asset: { _ref: string } };
  contactGeneral?: string;
  contactPress?: string;
  contactInvestors?: string;
  contactPartnerships?: string;
  socialTwitter?: string;
  socialLinkedIn?: string;
  socialGitHub?: string;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  googleVerification?: string;
  gaId?: string;
}

export interface AuthorizedUser {
  _id: string;
  username: string;
  role: "admin" | "editor";
  lastLogin?: string;
  active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  date: string;
  read: boolean;
}

export interface JobListing {
  id: string;
  title: string;
  location: string;
  department: string;
  type: string;
  subsidiary: string;
  url?: string;
}
