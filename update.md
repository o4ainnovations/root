# O4A Corporate Website — System Audit & Enterprise Upgrade Plan

## 1. Current Content Handling vs Enterprise Target

### 1.1 Current State: Hybrid (CMS fragments + Hardcoded)

The site currently uses a fragmented approach — some data from Sanity, most hardcoded. No unified content strategy.

**CMS-Driven:**
| Page | From Sanity |
|---|---|
| `/portfolio` | Subsidiary documents — name, industry, status, description, URL, logo |
| `/portfolio/[slug]` | Subsidiary document |
| `/about` | Team members — name, title, bio, photo, type |
| `/news` | Press releases — title, date, body, category, slug |
| `/news/[slug]` | Press release document |
| `/investors` | Download documents |

**Hardcoded:**
| Page | Hardcoded Content |
|---|---|
| `/` | Company name, tagline, nav links |
| `/portfolio` | Header intro text, section headings |
| `/about` | Mission text (3 paragraphs), timeline events, stats, key figures sidebar |
| `/investors` | Ownership text, governance text, financials text, contact sidebar |
| `/news` | Intro text, media contact sidebar |
| `/careers` | Why O4A, values, hiring process, job listings — 100% hardcoded |
| `/contact` | Sidebar emails, office info |
| `/legal` | All 5 legal sections — 100% hardcoded |
| `/esg` | All 4 ESG sections — 100% hardcoded |

~60% of content is hardcoded in JSX. Requires code changes + redeploy to edit.

### 1.2 Enterprise Target: Templates Hardcoded, Content Sanity

| Layer | Where | Who Touches It | Changes? |
|---|---|---|---|
| **Template** (layout, grid, animations, structure) | `src/app/*.tsx` (code) | Developers | Rarely — after creation, template is stable |
| **Content** (text, images, settings, SEO fields) | Sanity Cloud (JSON) | Editors via `/admin/editor/[page]` | Anytime — no code, no deploy |

Every public page follows this pattern. Zero hardcoded text in any template.

---

## 2. Final Admin Architecture

### 2.1 Top-Level Admin Routes (6)

| Route | Purpose |
|---|---|
| `/admin` | Dashboard — stats, activity feed, quick actions, unread messages |
| `/admin/editor` | Content editor — list of public pages, click to edit |
| `/admin/editor/[page]` | Per-public-page editor — flat named fields, top to bottom |
| `/admin/editor/[page]/[slug]` | Per-document detail editor |
| `/admin/media` | Media library — single source of truth for all assets |
| `/admin/messages` | Contact submissions inbox |
| `/admin/settings` | Site settings |
| `/admin/access` | Team access control |

### 2.2 Editor Sub-Pages

| Route | Edits Public Page | Manages |
|---|---|---|
| `/admin/editor/home` | `/` | Company name, tagline |
| `/admin/editor/portfolio` | `/portfolio` | All subsidiaries (inline + CRUD) |
| `/admin/editor/portfolio/[slug]` | `/portfolio/[slug]` | Single subsidiary editor |
| `/admin/editor/about` | `/about` | Team members + timeline |
| `/admin/editor/investors` | `/investors` | Downloads + text sections |
| `/admin/editor/news` | `/news` | Press releases (inline + CRUD) |
| `/admin/editor/news/[slug]` | `/news/[slug]` | Single press release editor |
| `/admin/editor/careers` | `/careers` | Why O4A, values, hiring process |
| `/admin/editor/careers/jobs/[slug]` | `/careers/jobs/[slug]` | Single job editor |
| `/admin/editor/contact` | `/contact` | Sidebar info (emails, address) |
| `/admin/editor/legal` | `/legal` | All 5 legal sections |
| `/admin/editor/esg` | `/esg` | All 4 ESG sections |

### 2.3 Editor Experience — Flat Named Fields

Every editor page presents a flat, linear form. Fields are laid out in the same order as the public page. Each field has a human-readable name. No page builder blocks. No drag-and-drop. No "add section" buttons. One Save button at the bottom.

**Example — `/admin/editor/investors`:**
```
── Meta Information ──
Meta Title, Meta Description, Social Share Image

── Page Content ──
Ownership Section Heading, Ownership Section Body
Governance Section Heading, Governance Section Body
Financial Overview Heading, Financial Overview Body

── Downloads ──
[+ Upload]  Existing downloads list with delete

── Contact Info ──
Contact Email, Response Time

[Save]
```

### 2.4 Page Creation — Template Selection

Creating a new page only available from `[slug]` templates:
- `portfolio/[slug]` → new subsidiary detail
- `news/[slug]` → new press release detail
- `careers/jobs/[slug]` → new job detail

Flow: Select template → set permission (Public/Private/Permission) → page created → edit content.

No generic page template. To add a new template type, a developer creates the code file — it then appears as selectable.

### 2.5 Auto-Propagation

Data-driven listing pages update automatically when new documents are created:
- New subsidiary → `/portfolio` updates
- New press release → `/news` updates
- New job → `/careers/jobs` updates

Editors never manually edit listing pages.

---

## 3. Media System

### 3.1 `/admin/media` — Single Source of Truth

All images, videos, documents uploaded through `/admin/media`. No hardcoded assets anywhere.

| Upload Field | Detail |
|---|---|
| File | Drag-and-drop or picker |
| Slug | Manual or auto-generated from filename |
| Type | Image / Video / Document / Other (auto-detected if not picked) |
| Visibility | Public / Private / Permission |
| Secret Key | Only if Permission selected |

### 3.2 Document Types

| Category | Extensions |
|---|---|
| Image | `.png` `.jpg` `.jpeg` `.webp` `.svg` `.gif` `.avif` |
| Video | `.mp4` `.webm` `.mov` `.avi` |
| Document | `.md` `.pdf` `.docx` `.txt` |
| Other | Editor picks "Other" OR unmatched |

### 3.3 Public URL Structure

| Type | URL |
|---|---|
| Image | `/img/{slug}` |
| Video | `/vid/{slug}` |
| Document | `/doc/{slug}` |
| Other | `/c/{slug}` |

### 3.4 Visibility

| Setting | Public Behavior |
|---|---|
| Public | Accessible at URL |
| Private | 404. Only in `/admin/media` |
| Permission | Redirects to `/hello?ref={url}` |

### 3.5 `/hello` Permission Gate

Generic gate for both assets and pages. Two modes: Raw (plain form) or Covered (Antique Press themed template). Correct key → redirect to original URL.

---

## 4. Contact System

### 4.1 No Formspree — Self-Hosted

Submission stored in Sanity (`contactSubmission` type). Email notification via Resend. Spam via reCAPTCHA v3 + honeypot.

### 4.2 Admin Inbox (`/admin/messages`)

Full inbox: read/unread, archive, filter by category, search, reply (opens email client), internal notes, CSV export.

---

## 5. Content Architecture — Sanity Cloud

### 5.1 Document Types

| Type | Content | Public Page(s) |
|---|---|---|
| `subsidiary` | Portfolio companies | `/portfolio`, `/portfolio/[slug]` |
| `teamMember` | Leadership + board | `/about` |
| `pressRelease` | Press releases | `/news`, `/news/[slug]` |
| `download` | Investor documents | `/investors` |
| `pageContent` | All static page text content | All static pages |
| `job` | Career listings | `/careers/jobs`, `/careers/jobs/[slug]` |
| `contactSubmission` | Form messages | `/admin/messages` |
| `siteSettings` | Company settings | All pages (via SEO library) |
| `authorizedUser` | Admin access | `/admin/access` |
| `mediaAsset` | Uploaded files (planned) | `/img/*`, `/vid/*`, `/doc/*`, `/c/*` |

### 5.2 Dedicated SEO Fields (Per Document)

Every document type has an `seo` object: `metaTitle`, `metaDescription`, `ogImage`, `keywords[]`, `noindex`. Editors fill these explicitly — NOT auto-derived from content body.

---

## 6. Phased Implementation Plan

Each phase contains tasks that run in parallel. Phases must run sequentially.

### Phase 1: Critical Bug Fixes & CSS Definitions ✅

| # | Task | Status |
|---|---|---|
| 1.1 | Remove `next-themes` from sonner | ✅ |
| 1.2 | Define `--color-ink` CSS token | ✅ |
| 1.3 | Define `--color-gold` CSS token | ✅ |
| 1.4 | Remove conflicting `metadata` from sitemap.ts | ✅ |
| 1.5 | Remove unused `next-sitemap` + `next-themes` | ✅ |
| 1.6 | Remove dead `jobs` variable from careers | ✅ |
| 1.7 | Remove redundant auth call in admin dashboard | ✅ |
| 1.8 | Add `signOut: "/"` to authOptions | ✅ |
| 1.9 | Simplify layout children prop | ✅ |

### Phase 2: Infrastructure & Config ✅

| # | Task | Status |
|---|---|---|
| 2.1 | Admin route protection | ✅ (layout-level auth, Next.js 16 deprecated middleware) |
| 2.2 | `images.remotePatterns` + AVIF/WebP | ✅ |
| 2.3 | Security headers (7 headers) | ✅ |
| 2.4 | Skeleton shadcn component | ✅ |

### Phase 3: Missing Routes & Loading States ✅

| # | Task | Status |
|---|---|---|
| 3.1 | `/news/[slug]` detail page | ✅ |
| 3.2 | `/portfolio/[slug]` detail page | ✅ |
| 3.3 | 6 `loading.tsx` files | ✅ |
| 3.4 | PortableText renderer component | ✅ |

### Phase 4: Sanity Studio Embed ✅

| # | Task | Status |
|---|---|---|
| 4.1 | Install `sanity` + `@sanity/vision` | ✅ |
| 4.2 | `sanity.config.ts` with all 5 schemas | ✅ |
| 4.3 | `sanity.cli.ts` | ✅ |
| 4.4 | Studio route at `/studio` | ✅ |
| 4.5 | CMS Studio link in admin navbar | ✅ |

### Phase 5: Enterprise SEO Library

| # | Task |
|---|---|
| 5.1 | Create `src/lib/seo/constants.ts` — company data |
| 5.2 | Create `src/lib/seo/types.ts` |
| 5.3 | Create `src/lib/seo/metadata.ts` — `buildMetadata()` |
| 5.4 | Create `src/lib/seo/structured-data.ts` — 8 schema generators |
| 5.5 | Create `src/lib/seo/components/json-ld.tsx` |
| 5.6 | Create `src/lib/seo/components/breadcrumb.tsx` |
| 5.7 | Create `src/lib/seo/index.ts` — barrel export |

### Phase 6: Apply SEO to All Pages

| # | Task |
|---|---|
| 6.1 | Update root layout with global SEO metadata |
| 6.2 | Update homepage with Corporation + WebSite JSON-LD |
| 6.3 | Update portfolio + portfolio/[slug] with BreadcrumbList |
| 6.4 | Update about with Corporation + Person per team member |
| 6.5 | Update investors with BreadcrumbList |
| 6.6 | Update news + news/[slug] with NewsArticle schema |
| 6.7 | Update careers + careers/jobs/[slug] with JobPosting |
| 6.8 | Update contact with BreadcrumbList |
| 6.9 | Update legal with noindex + BreadcrumbList |
| 6.10 | Update ESG with BreadcrumbList |
| 6.11 | Update 404 with noindex |

### Phase 7: Sitemap Upgrades

| # | Task |
|---|---|
| 7.1 | Create `sitemap-index.xml/route.ts` |
| 7.2 | Create `sitemap-news.xml/route.ts` (last 2 days) |
| 7.3 | Upgrade standard sitemap — priority, changefreq, real lastmod |
| 7.4 | Upgrade robots.txt — GPTBot block, sitemap index refs |

### Phase 8: CMS Content Migration

| # | Task |
|---|---|
| 8.1 | Wire `pageContent` to frontend — all static page text from Sanity |
| 8.2 | Add `job`, `contactSubmission`, `siteSettings`, `authorizedUser` schemas |
| 8.3 | Migrate legal content → Sanity `pageContent` documents |
| 8.4 | Migrate ESG content → Sanity |
| 8.5 | Migrate about text sections → Sanity |
| 8.6 | Migrate investors text → Sanity |
| 8.7 | Migrate careers text → Sanity |
| 8.8 | Migrate contact sidebar → Sanity |
| 8.9 | Delete all hardcoded text from page components |

### Phase 9: Enterprise Admin Rebuild

| # | Task |
|---|---|
| 9.1 | Create `/admin/editor/[page]` — flat named field forms per public page |
| 9.2 | Create all 10 server action files for CRUD |
| 9.3 | Create Zod validation schemas |
| 9.4 | Build `/admin/messages` — real inbox |
| 9.5 | Build `/admin/media` — upload, browse, permissions |
| 9.6 | Build `/admin/settings` — company settings form |
| 9.7 | Build `/admin/access` — user management |
| 9.8 | Build `/admin/editor` — index + template selection for new pages |
| 9.9 | Replace contact form action — server action + Sanity + Resend |

### Phase 10: Performance & Polish

| # | Task |
|---|---|
| 10.1 | Replace `<img>` with `next/image` for Sanity images |
| 10.2 | Add `fetchPriority` and `priority` for LCP elements |
| 10.3 | Add CSP nonce for Google Analytics |
| 10.4 | Rotate live credentials post-deployment |
| 10.5 | Full build verification + Lighthouse audit |

---

## 7. Dependency Graph

```
Phase 1 (Critical Fixes) ✅
    ↓
Phase 2 (Infrastructure) ✅
    ↓
    ┌───────────────┬────────────────┬──────────────┐
    ↓               ↓                ↓              ↓
Phase 3 (Routes) ✅  Phase 4 (Studio) ✅  Phase 5 (SEO Lib)
    ↓               ↓                ↓
    └───────┬───────┘                │
            ↓                        │
Phase 6 (Apply SEO) ←───────────────┘
    ↓
Phase 7 (Sitemaps)
    ↓
Phase 8 (CMS Migration) ←── Phase 4
    ↓
Phase 9 (Enterprise Admin) ←── Phase 8
    ↓
Phase 10 (Polish)
```

---

## 8. Files Summary

| Phase | Files Created | Files Modified | Total |
|---|---|---|---|
| Phase 1 | 0 | ~10 | ~10 |
| Phase 2 | 2 | 1 | ~3 |
| Phase 3 | 10 | 0 | ~10 |
| Phase 4 | 5 | 1 | ~6 |
| Phase 5 | 7 | 0 | ~7 |
| Phase 6 | 0 | ~15 | ~15 |
| Phase 7 | 2 | 2 | ~4 |
| Phase 8 | ~10 | ~9 | ~19 |
| Phase 9 | ~25 | ~8 | ~33 |
| Phase 10 | 0 | ~5 | ~5 |
| **Total** | **~61** | **~51** | **~112** |
