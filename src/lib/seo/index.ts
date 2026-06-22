export { buildMetadata } from "./metadata";
export {
  buildCorporationSchema,
  buildWebSiteSchema,
  buildBreadcrumbSchema,
  buildNewsArticleSchema,
  buildPersonSchema,
  buildFaqSchema,
  buildJobPostingSchema,
  buildEventSchema,
} from "./structured-data";
export { JsonLd } from "./components/json-ld";
export { BreadcrumbSchema, BreadcrumbNav } from "./components/breadcrumb";
export { COMPANY } from "./constants";
export type {
  PageSeoConfig,
  BreadcrumbItem,
  JsonLdProps,
  NewsArticleConfig,
  PersonConfig,
  JobPostingConfig,
  EventConfig,
} from "./types";
