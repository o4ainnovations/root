import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/seo/constants";

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/studio/"],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
    ],
    sitemap: [
      `${COMPANY.url}/sitemap-index.xml`,
      `${COMPANY.url}/sitemap-news.xml`,
    ],
  };
}
