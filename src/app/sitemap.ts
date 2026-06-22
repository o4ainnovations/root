import { sanityFetch } from "@/lib/sanity";
import { COMPANY } from "@/lib/seo/constants";
import type { Subsidiary, PressRelease } from "@/types";

const BASE_URL = COMPANY.url;

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

export default async function Sitemap() {
  const [subsidiaries, releases] = await Promise.all([
    sanityFetch<Subsidiary[]>({
      query: `*[_type == "subsidiary" && status == "active"] { _id, slug, _updatedAt }`,
      tags: ["subsidiary"],
    }),
    sanityFetch<PressRelease[]>({
      query: `*[_type == "pressRelease"] | order(date desc) { _id, slug, _updatedAt, date }`,
      tags: ["pressRelease"],
      revalidate: 300,
    }),
  ]);

  const staticPages: SitemapEntry[] = [
    { url: `${BASE_URL}`, lastModified: new Date().toISOString(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/portfolio`, lastModified: new Date().toISOString(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/investors`, lastModified: new Date().toISOString(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/news`, lastModified: new Date().toISOString(), changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/careers`, lastModified: new Date().toISOString(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/careers/jobs`, lastModified: new Date().toISOString(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/esg`, lastModified: new Date().toISOString(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const subsidiaryRoutes: SitemapEntry[] = subsidiaries.map((s) => ({
    url: `${BASE_URL}/portfolio/${s.slug.current}`,
    lastModified: s._updatedAt || new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const pressRoutes: SitemapEntry[] = releases.map((r) => ({
    url: `${BASE_URL}/news/${r.slug.current}`,
    lastModified: r._updatedAt || new Date().toISOString(),
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [...staticPages, ...subsidiaryRoutes, ...pressRoutes];
}
