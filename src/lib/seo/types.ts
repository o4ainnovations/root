export interface PageSeoConfig {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  ogImage?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
  robots?: {
    index: boolean;
    follow: boolean;
  };
  breadcrumb?: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface JsonLdProps {
  data: Record<string, unknown>;
  id?: string;
}

export interface NewsArticleConfig {
  headline: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  dateModified?: string;
}

export interface PersonConfig {
  name: string;
  jobTitle: string;
  description: string;
  imageUrl?: string;
  url: string;
}

export interface JobPostingConfig {
  title: string;
  description: string;
  datePosted: string;
  location: string;
  employmentType: string;
  url: string;
}

export interface EventConfig {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  url: string;
}
