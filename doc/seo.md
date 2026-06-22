# Enterprise SEO Architecture — O4A (o4ainnovations.com)

## System Design: Dynamic, Per-Page Enterprise SEO

All SEO data (metadata, JSON-LD, OpenGraph, Twitter Cards) is generated **dynamically per page** from a shared library at `src/lib/seo/`. No page hardcodes its own SEO tags. Instead, every page calls a type-safe helper that reads **dedicated SEO fields** from Sanity documents.

**Key principle:** SEO fields (`metaTitle`, `metaDescription`, `ogImage`, `keywords`, `noindex`) are **explicitly filled by editors** in the Sanity CMS. They are never auto-derived from content body or document title. This gives editors full control over what appears in search results.

---

## Architecture Overview

```
src/lib/seo/
├── index.ts              # Public API — re-exports everything
├── metadata.ts           # buildMetadata(config) → Next.js Metadata
├── structured-data.ts    # 8 schema generators (Corporation, WebSite, etc.)
├── constants.ts          # Company data (name, URL, socials, OG defaults, etc.)
├── types.ts              # PageSeoConfig, JsonLdProps, BreadcrumbItem
└── components/
    ├── json-ld.tsx       # <JsonLd> — injects any schema into <head>
    └── breadcrumb.tsx    # <BreadcrumbSchema> + <BreadcrumbNav>
```

---

## 1. Company Constants — Single Source of Truth

**File:** `src/lib/seo/constants.ts`

```ts
export const COMPANY = {
  name: "O4A",
  legalName: "O4A Innovations Ltd",
  alternateName: ["O4A", "O4A Innovations"],
  url: "https://o4ainnovations.com",
  description:
    "O4A Innovations is a visionary software company spearheading the next generation of global tech players in Nigeria. As a parent founder company, we are dedicated to designing and launching innovative ventures that are built to scale and dominate the ever-evolving tech landscape.",
  slogan: "Building the Technologies that power the future.",
  foundingDate: "2026",

  logo: "https://o4ainnovations.com/images/og/logo.png",
  ogImage: {
    url: "https://o4ainnovations.com/images/og/o4a.png",
    width: 1200,
    height: 630,
    alt: "O4A Innovations — Building the Technologies that power the future.",
  },
  twitterHandle: "@o4ainnovations",

  address: {
    addressCountry: "NG",
  },

  sameAs: [
    "https://x.com/o4ainnovations",
    "https://www.linkedin.com/company/o4ainnovations",
    "https://github.com/o4ainnovations",
  ],

  contact: {
    general: "mail@o4ainnovations.com",
    press: "mail@o4ainnovations.com",
    investors: "mail@o4ainnovations.com",
    partnerships: "mail@o4ainnovations.com",
  },

  googleVerification: "",  // DNS-verified, not meta tag
  gaId: "G-TZ184430DR",
};
```

---

## 2. TypeScript Types — Type-Safe SEO Configs

**File:** `src/lib/seo/types.ts`

```ts
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
    author?: string;
    section?: string;
    tags?: string[];
  };
  robots?: {
    index: boolean;
    follow: boolean;
  };
  breadcrumb?: BreadcrumbItem[];
  schema?: Record<string, unknown>[];
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}
```

---

## 3. Metadata Builder — Full SEO Payload Per Page

**File:** `src/lib/seo/metadata.ts`

Every page calls `buildMetadata(config)`. One config object produces:
- Title with template (`%s | O4A`)
- Description
- Canonical URL
- OpenGraph (24 tags: title, description, url, site_name, locale, type, image with dimensions + alt, article metadata)
- Twitter Card (summary_large_image with per-page image)
- Robots directives (index/follow per page)
- Icons (PNG primary + ICO fallback + apple + PWA manifest)
- Verification, theme-color, application-name, category, creator, publisher

```ts
export function buildMetadata(config: PageSeoConfig): Metadata {
  // See seo.md for full implementation
}
```

---

## 4. Structured Data Generators

**File:** `src/lib/seo/structured-data.ts`

Eight type-safe functions, each returning a JSON-LD object:

| Generator | Schema Type | Used On |
|---|---|---|
| `buildCorporationSchema()` | `Corporation` | Homepage, About |
| `buildWebSiteSchema()` | `WebSite` + `SearchAction` | Homepage |
| `buildBreadcrumbSchema(items)` | `BreadcrumbList` | Every page |
| `buildNewsArticleSchema(config)` | `NewsArticle` | `/news/[slug]` |
| `buildPersonSchema(config)` | `Person` | Team bios on `/about` |
| `buildFaqSchema(questions)` | `FAQPage` | FAQ pages |
| `buildJobPostingSchema(config)` | `JobPosting` | `/careers/jobs/[slug]` |
| `buildEventSchema(config)` | `Event` | Investor calls |

---

## 5. Dedicated SEO Fields — Per Sanity Document

Every Sanity document type includes a reusable `seo` object that editors fill explicitly:

```ts
// Sanity schema — reusable SEO object
const seoFields = {
  name: "seo",
  title: "SEO & Social",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    {
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "50-60 characters. What appears in search results.",
      validation: (Rule) => Rule.max(70).warning("Max 70 chars"),
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      description: "150-160 characters. The snippet under the title in search results.",
      validation: (Rule) => Rule.max(200).warning("Max 200 chars"),
    },
    {
      name: "ogImage",
      title: "Social Share Image",
      type: "image",
      description: "1200×630px. What appears when shared on social media.",
    },
    {
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "noindex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    },
  ],
};
```

Attached to: `subsidiary`, `teamMember`, `pressRelease`, `download`, `pageContent`, `job`.

---

## 6. Per-Page Integration Pattern

### Static Page (no Sanity document)

```tsx
// /about page.tsx
export const metadata: Metadata = buildMetadata({
  title: "About",
  description: pageContent.seo.metaDescription,  // from Sanity pageContent slug "about"
  path: "/about",
});
```

### Dynamic Page (from Sanity document)

```tsx
// /news/[slug] page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const release = await sanityFetch(query, { slug });
  return buildMetadata({
    title: release.seo?.metaTitle || release.title,
    description: release.seo?.metaDescription || "",
    path: `/news/${release.slug.current}`,
    ogType: "article",
    ogImage: release.seo?.ogImage
      ? { url: urlFor(release.seo.ogImage).width(1200).height(630).url(), width: 1200, height: 630, alt: release.title }
      : undefined,
    article: {
      publishedTime: release.date,
      section: release.category,
    },
    robots: release.seo?.noindex ? { index: false, follow: true } : undefined,
  });
}
```

### Page with Multiple Schemas

```tsx
// Homepage
export default function HomePage() {
  return (
    <>
      <JsonLd data={buildCorporationSchema()} id="corp" />
      <JsonLd data={buildWebSiteSchema()} id="website" />
      {/* existing JSX */}
    </>
  );
}
```

---

## 7. Sitemap Infrastructure

### Sitemap Index (`sitemap-index.xml`)

```xml
<sitemapindex>
  <sitemap><loc>/sitemap.xml</loc></sitemap>
  <sitemap><loc>/sitemap-news.xml</loc></sitemap>
</sitemapindex>
```

### Standard Sitemap

Priority + changefreq + real `lastmod` from Sanity `_updatedAt`:

| Route | Priority | Changefreq |
|---|---|---|
| `/` | 1.0 | weekly |
| `/portfolio` | 0.9 | weekly |
| `/about` | 0.8 | monthly |
| `/investors` | 0.9 | weekly |
| `/news` | 0.8 | daily |
| `/careers` | 0.7 | weekly |
| `/careers/jobs` | 0.7 | daily |
| `/contact` | 0.6 | monthly |
| `/esg` | 0.5 | monthly |
| `/portfolio/[slug]` | 0.7 | weekly |
| `/news/[slug]` | 0.6 | daily |
| `/careers/jobs/[slug]` | 0.6 | daily |

Legal page excluded (noindex).

### News Sitemap

Only press releases from the **last 2 days** (Google News requirement). Auto-generated from Sanity.

---

## 8. Security Headers

In `next.config.ts`:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: (strict, allowing Sanity CDN, GA, Fonts, Formspree)
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin
```

---

## 9. Robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: GPTBot
Disallow: /

Sitemap: https://o4ainnovations.com/sitemap-index.xml
Sitemap: https://o4ainnovations.com/sitemap-news.xml
```

---

## 10. Implementation Checklist

### Files to Create

```
src/lib/seo/
├── index.ts
├── constants.ts
├── types.ts
├── metadata.ts
├── structured-data.ts
└── components/
    ├── json-ld.tsx
    └── breadcrumb.tsx

src/app/
├── sitemap-index.xml/route.ts
└── sitemap-news.xml/route.ts
```

### Pages to Update (replace `export const metadata` with `buildMetadata()`)

```
src/app/layout.tsx          → global SEO metadata enhancements
src/app/page.tsx             → Corporation + WebSite JSON-LD
src/app/portfolio/page.tsx   → BreadcrumbList
src/app/portfolio/[slug]/page.tsx → BreadcrumbList
src/app/about/page.tsx       → Corporation + Person per team member
src/app/investors/page.tsx   → BreadcrumbList
src/app/news/page.tsx        → BreadcrumbList
src/app/news/[slug]/page.tsx → NewsArticle schema + article OG
src/app/careers/page.tsx     → BreadcrumbList
src/app/careers/jobs/page.tsx → (future) BreadcrumbList
src/app/careers/jobs/[slug]/page.tsx → (future) JobPosting
src/app/contact/page.tsx     → BreadcrumbList
src/app/legal/page.tsx       → noindex + BreadcrumbList
src/app/esg/page.tsx         → BreadcrumbList
src/app/not-found.tsx        → noindex
```

### Sanity Schemas to Update

Add dedicated `seo` object field to: `subsidiary`, `teamMember`, `pressRelease`, `download`, `pageContent`, `job`.
