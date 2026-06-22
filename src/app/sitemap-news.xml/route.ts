import { sanityClient } from "@/lib/sanity";
import { COMPANY } from "@/lib/seo/constants";

interface NewsRelease {
  title: string;
  slug: { current: string };
  date: string;
}

export const revalidate = 3600;

export async function GET() {
  const twoDaysAgo = new Date(
    Date.now() - 2 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const releases = await sanityClient.fetch<NewsRelease[]>(
    `*[_type == "pressRelease" && date > $twoDaysAgo] | order(date desc) { title, slug, date }`,
    { twoDaysAgo },
  );

  const urls = releases
    .map(
      (r) => `  <url>
    <loc>${COMPANY.url}/news/${r.slug.current}</loc>
    <news:news>
      <news:publication>
        <news:name>${COMPANY.name} Press Room</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(r.date).toISOString()}</news:publication_date>
      <news:title><![CDATA[${r.title}]]></news:title>
    </news:news>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
