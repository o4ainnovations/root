import { COMPANY } from "@/lib/seo/constants";

export async function GET() {
  const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${COMPANY.url}/sitemap.xml</loc></sitemap>
  <sitemap><loc>${COMPANY.url}/sitemap-news.xml</loc></sitemap>
</sitemapindex>`;

  return new Response(index, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
