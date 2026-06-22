# O4A Corporate Website — Master Architecture Specification

## 1. Company Identity

| Field | Value |
|---|---|
| Company | O4A |
| Legal name | O4A Innovations Ltd |
| Domain | o4ainnovations.com |
| Second site | o4a.world (separate product/project showcase — not this project) |
| Founded | 2026 |
| Location | Nigeria |
| Structure | Private holding company (like Alphabet) |
| Email | mail@o4ainnovations.com |
| DNS | names.co.uk registrar → Cloudflare nameservers (email routing + CDN) |
| Hosting | Vercel (Next.js) |

**Taglines:**
- Short: *"O4A Innovations is a company designed to scale the next wave of global players. Now, it is our turn!"*
- General: *"Building the Technologies that power the future."*

**Full description:** O4A Innovations is a visionary software company spearheading the next generation of global tech players in Nigeria. As a parent founder company, we are dedicated to designing and launching innovative ventures that are built to scale and dominate the ever-evolving tech landscape. With a strong foundation in a diverse portfolio of tech companies, we are committed to shaping the future of technology and empowering the next wave of industry leaders. We believe it is our time to make a significant impact on the global stage.

**Socials & Profiles:**
| Platform | URL |
|---|---|
| X / Twitter | x.com/o4ainnovations |
| LinkedIn | linkedin.com/company/o4ainnovations |
| GitHub | github.com/o4ainnovations |

**Services Used:**
| Service | Purpose | Key |
|---|---|---|
| Sanity | Cloud CMS (content database) | Project `x8ferdv3` |
| NextAuth | Authentication (GitHub OAuth) | OAuth app configured |
| Vercel | Hosting | cname.vercel-dns.com |
| Cloudflare | DNS, CDN proxy, email routing | Nameservers |
| Google Analytics | Analytics | `G-TZ184430DR` |
| Resend | Email notifications (planned) | Not yet configured |
| reCAPTCHA | Spam prevention (planned) | Not yet configured |

---

## 2. Design System — "Antique Press"

### 2.1 Core Principle
A print-first, enterprise-grade design system inspired by antique newspapers and premium editorial publications. Single intentional theme — no dark mode. No rounded corners. No bright colors.

### 2.2 Color Palette

| Role | Hex | CSS Variable |
|---|---|---|
| Background (paper) | `#F4EBD9` | `--background` |
| Paper highlight | `#F7F1E0` | `--paper-highlight` |
| Paper shadow | `#EDE4CF` | `--paper-shadow` |
| Primary ink / borders | `#3C2317` | `--primary` |
| Body text | `#2C2420` | `--foreground` |
| Gold accent | `#C9A96E` | `--accent` |
| Muted ink | `#8B7D72` | `--muted-foreground` |
| Hairline rules | `#D9CFBD` | `--hairline` |

### 2.3 Typography

| Tier | Font | Role | Style |
|---|---|---|---|
| Headings | Playfair Display (serif) | Authority, editorial weight | Bold, optical sizing, oldstyle nums |
| Body | Lora (serif) | Readability, print feel | 400 weight, 1.65 leading |
| UI / Labels | Inter (sans-serif) | Navigation, data, metadata | Uppercase, 0.08-0.12em tracking |
| Data / Figures | JetBrains Mono (mono) | Financials, statistics | Tabular nums |

### 2.4 Border & Shadow System

| Element | Specification |
|---|---|
| Section rules | 2px solid `--primary` |
| Container borders | 1px solid `--primary` |
| Hairline dividers | 1px solid `--hairline` |
| Double rules | 2px + 4px gap + 2px, optional center ornament |
| Border radius | 0 everywhere |
| Paper texture | CSS SVG noise filter at 3% opacity |

### 2.5 Card Depth System

| Level | Name | CSS |
|---|---|---|
| 1 | Base surface | `bg-background border border-border` |
| 2 | Raised card | Gradient bg + `border-top: 2px` + `box-shadow: 2px 3px 0 rgba(60,35,23,0.12)` |
| 3 | Floating/dropdown | `bg-paper-highlight` + deeper shadow: `4px 6px 0 rgba(...)` |
| -1 | Inset | `bg-paper-shadow` + inset shadow |

### 2.6 Homepage (abc.xyz style)

Full-viewport height, centered, no scroll.
- Sepia border around viewport
- Company name (Playfair Display, large)
- Thin HR rule
- Tagline
- Navigation links (6 items, uppercase Inter)
- Minimal footer

---

## 3. Architecture Principles

### 3.1 Core Rule: Templates vs Content

| Layer | Where | Who Changes It | Never Changes? |
|---|---|---|---|
| **Templates** (HTML structure, grid, layout, animations, routing) | Code (`src/app/*.tsx`) | Developers | Yes — hardcoded after creation |
| **Content** (text, images, settings, SEO fields) | Sanity Cloud (JSON documents) | Editors via `/admin/editor/[page]` | No — editable anytime |

**No hardcoded text in any template.** The template is a pure layout shell. All visible content is fetched from Sanity.

### 3.2 Content Flow

```
Editor in /admin/editor/[page]
    → Fills form fields (named, flat, human-readable)
        → Server Action validates + saves
            → Sanity Cloud (mutate API)
                → ISR revalidation triggered
                    → Public site refreshed (≤60s)
```

### 3.3 Auto-Propagation

Data-driven listing pages update automatically when new documents are created:

| Action | Auto-Updates |
|---|---|
| Create a new subsidiary in `/admin/editor/portfolio` | `/portfolio` list |
| Create a new press release in `/admin/editor/news` | `/news` list |
| Create a new job in `/admin/editor/careers` | `/careers/jobs` list |

Editors never manually edit listing pages. They only create the individual documents.

---

## 4. Complete Route Map

### 4.1 Public Pages (14 routes)

| Route | Code Template | Data Source (Sanity) | Page Type |
|---|---|---|---|
| `/` | `src/app/page.tsx` | `pageContent` slug `"home"` | Static |
| `/portfolio` | `src/app/portfolio/page.tsx` | `pageContent` slug `"portfolio"` + `subsidiary` docs | Listing (auto) |
| `/portfolio/[slug]` | `src/app/portfolio/[slug]/page.tsx` | `subsidiary` document | Detail |
| `/about` | `src/app/about/page.tsx` | `pageContent` slug `"about"` + `teamMember` docs | Static + Listing |
| `/investors` | `src/app/investors/page.tsx` | `pageContent` slug `"investors"` + `download` docs | Static + Listing |
| `/news` | `src/app/news/page.tsx` | `pageContent` slug `"news"` + `pressRelease` docs | Listing (auto) |
| `/news/[slug]` | `src/app/news/[slug]/page.tsx` | `pressRelease` document | Detail |
| `/careers` | `src/app/careers/page.tsx` | `pageContent` slug `"careers"` | Static |
| `/careers/jobs` | `src/app/careers/jobs/page.tsx` | `job` documents | Listing (auto) |
| `/careers/jobs/[slug]` | `src/app/careers/jobs/[slug]/page.tsx` | `job` document | Detail |
| `/contact` | `src/app/contact/page.tsx` | `pageContent` slug `"contact"` | Static |
| `/legal` | `src/app/legal/page.tsx` | `pageContent` slug `"legal"` | Static |
| `/esg` | `src/app/esg/page.tsx` | `pageContent` slug `"esg"` | Static |
| `/hello` | `src/app/hello/page.tsx` | None — permission gate | Utility |

### 4.2 Admin Pages (6 top-level routes + editor sub-pages)

| Route | Purpose |
|---|---|
| `/admin` | Dashboard — stats, recent activity, quick actions, unread messages |
| `/admin/editor` | Content editor index — lists all public pages, click to edit |
| `/admin/editor/[page]` | Per-public-page editor — flat named fields from top to bottom |
| `/admin/editor/[page]/[slug]` | Per-document editor — detail view (subsidiary, press release, job) |
| `/admin/media` | Media library — single source of truth for all assets |
| `/admin/messages` | Inbox — Sanity-stored contact submissions |
| `/admin/settings` | Site settings — company info, taglines, socials, emails, OG defaults |
| `/admin/access` | Team access — authorized GitHub usernames with roles |

### 4.3 Admin Editor Sub-Routes

| Route | Edits Public Page | Also Manages |
|---|---|---|
| `/admin/editor/home` | `/` | Company name, tagline |
| `/admin/editor/portfolio` | `/portfolio` | All subsidiaries (inline list + CRUD) |
| `/admin/editor/portfolio/[slug]` | `/portfolio/[slug]` | Single subsidiary editor |
| `/admin/editor/about` | `/about` | All team members + timeline |
| `/admin/editor/investors` | `/investors` | All downloads (upload + list) |
| `/admin/editor/news` | `/news` | All press releases (inline list + CRUD) |
| `/admin/editor/news/[slug]` | `/news/[slug]` | Single press release editor |
| `/admin/editor/careers` | `/careers` | Why O4A, values, hiring process text |
| `/admin/editor/careers/jobs/[slug]` | `/careers/jobs/[slug]` | Single job editor |
| `/admin/editor/contact` | `/contact` | Sidebar info (emails, address) |
| `/admin/editor/legal` | `/legal` | All 5 legal sections |
| `/admin/editor/esg` | `/esg` | All 4 ESG sections |

---

## 5. Content Architecture — Sanity Cloud

### 5.1 Document Types

| Sanity Type | Stores | Public Page(s) |
|---|---|---|
| `subsidiary` | Portfolio companies (name, industry, description, status, logo, URL, order, SEO) | `/portfolio`, `/portfolio/[slug]` |
| `teamMember` | Leadership + board (name, title, bio, photo, type, order, SEO) | `/about` |
| `pressRelease` | Press releases (title, date, category, body, PDF, featured, SEO) | `/news`, `/news/[slug]` |
| `download` | Investor documents (title, file, category, publish date) | `/investors` |
| `pageContent` | All text content per public page (structured fields per template, SEO) | All static pages |
| `job` | Career listings (title, department, location, type, subsidiary, description, apply URL, SEO) | `/careers/jobs`, `/careers/jobs/[slug]` |
| `contactSubmission` | Contact form messages (name, email, category, subject, message, attachments, read, archived) | `/admin/messages` |
| `siteSettings` | Company settings (names, taglines, socials, emails, GA ID, OG defaults) | All pages (via SEO library) |
| `authorizedUser` | Admin access control (GitHub username, role, last login) | `/admin/access` |

### 5.2 Dedicated SEO Fields (Per Document)

Every Sanity document type includes an `seo` object:
- `metaTitle` — explicit title for search engines (50-60 chars)
- `metaDescription` — explicit description (150-160 chars)
- `ogImage` — social share image override
- `keywords` — array of keyword strings
- `noindex` — boolean toggle

**Not auto-derived from content.** Editors fill these explicitly.

### 5.3 CMS Editor Design — Flat Named Fields

Every editor page presents a flat, linear form. Fields are laid out in the same order as they appear on the public page. Each field has a human-readable name. No "add block" menus. No drag-and-drop. No nesting. One Save button at the bottom.

**Example — `/admin/editor/investors`:**
```
── Meta Information ──
Meta Title              [___________]
Meta Description        [___________]
Social Share Image      [Upload]

── Page Content ──
Ownership Section Heading   [___________]
Ownership Section Body      [___________]
Governance Section Heading  [___________]
Governance Section Body     [___________]
Financial Overview Heading  [___________]
Financial Overview Body     [___________]

── Downloads ──
[+ Upload]  │ Annual Report   │ 2026 │ [×] │  ...

── Contact Info ──
Contact Email       [___________]
Response Time       [___________]

[Save]
```

---

## 6. Page Creation System

### 6.1 Creating a New Page

Only templates that end in `[slug]` are available for creating new pages:

| Selectable Template | Creates | Data Source |
|---|---|---|
| `portfolio/[slug]` | New subsidiary detail page | `subsidiary` document |
| `news/[slug]` | New press release detail page | `pressRelease` document |
| `careers/jobs/[slug]` | New job detail page | `job` document |

**Flow:**
1. Editor clicks "Create New Page" in `/admin/editor`
2. Selects a template from the list
3. Sets permission (Public / Private / Permission with secret key)
4. Page is created → editor fills in content

No generic page template exists. To add a new template type, a developer creates the code file (`src/app/[route]/[slug]/page.tsx`) — then it appears as a selectable template.

### 6.2 Permission on Pages

Set at creation time:
- **Public** — accessible to everyone
- **Private** — only viewable by logged-in admin users
- **Permission** — redirects to `/hello?ref={url}`, user must enter secret key

### 6.3 Static Pages

`/about`, `/investors`, `/contact`, `/legal`, `/esg`, `/careers` are fixed templates. Their content is editable from `/admin/editor/[page]`. They are never used as templates for creating new pages.

---

## 7. Media System

### 7.1 `/admin/media` — Single Source of Truth

All images, videos, and documents are uploaded exclusively through `/admin/media`. No hardcoded assets. No direct Sanity asset references in code. Everything is managed from this page:

```
┌──────────────────────────────────────────────┐
│ Media Library                                │
│                                              │
│ [Images] [Videos] [Documents] [Other]        │
│                                              │
│ ┌────────┐ ┌────────┐ ┌────────┐            │
│ │hero.png│ │logo.png│ │chart.. │            │
│ │Public  │ │Public  │ │Private │            │
│ └────────┘ └────────┘ └────────┘            │
│                                              │
│ [+ Upload]                                   │
└──────────────────────────────────────────────┘
```

### 7.2 Upload Form

| Field | Detail |
|---|---|
| **File** | Drag-and-drop or file picker |
| **Slug** | Editor types manually. If blank, auto-generated from filename |
| **Type** | Image / Video / Document / Other. If not picked, auto-detected from extension |
| **Visibility** | Public / Private / Permission |
| **Secret Key** | Only if "Permission" selected |

### 7.3 Document Type Detection

| Category | Extensions |
|---|---|
| **Image** | `.png` `.jpg` `.jpeg` `.webp` `.svg` `.gif` `.avif` |
| **Video** | `.mp4` `.webm` `.mov` `.avi` |
| **Document** | `.md` `.pdf` `.docx` `.txt` |
| **Other** | Editor picks "Other" OR type not picked AND doesn't match any above category |

### 7.4 Public URL Structure

| Type | URL Pattern | Example |
|---|---|---|
| Image | `/img/{slug}` | `/img/hero-banner` |
| Video | `/vid/{slug}` | `/vid/company-intro` |
| Document | `/doc/{slug}` | `/doc/annual-report-2025` |
| Other | `/c/{slug}` | `/c/some-file` |

### 7.5 Visibility Rules

| Setting | Public URL Behavior |
|---|---|
| **Public** | Accessible to anyone at the URL. Raw file served or styled viewer page. |
| **Private** | Public URL returns 404. Only viewable in `/admin/media`. |
| **Permission** | Public URL redirects to `/hello?ref={url}`. Enter correct secret key → access granted. |

### 7.6 `/hello` Permission Gate

A generic gate page at `/hello` used for both assets and pages requiring permission:
- **Raw mode** — plain unstyled form: "Enter secret key to continue"
- **Covered mode** — Antique Press themed template with context about what's behind the gate
- Wrong key → error, try again
- Correct key → redirected to original URL

### 7.7 Media Selection in Editor

When an editor clicks an image/media field in any `/admin/editor/[page]`:
1. Modal opens showing all media from `/admin/media` (filtered by type: Images / Videos / Documents)
2. Editor selects an asset → modal closes
3. Field shows `[📷 filename.png] [Replace]`
4. Clicking [Replace] reopens the modal

---

## 8. Contact System

No Formspree. Self-hosted via server actions.

### 8.1 Submission Flow

```
Visitor fills contact form on /contact
    ↓
Server Action (runs on Vercel)
    ↓
├── Creates contactSubmission document in Sanity
│     → Appears in /admin/messages immediately
│
├── Sends email notification via Resend → mail@o4ainnovations.com
│
└── Returns success → toast on client
```

### 8.2 Admin Messages Page (`/admin/messages`)

Full inbox functionality:
- Table: date, name, email, category, subject preview, read/unread indicator
- Click to expand → full message with attachments
- Mark as read / archive
- Reply button (opens email client with pre-filled address)
- Add internal notes (visible only in admin)
- Filter by category (general, media, investor, partnership, legal)
- Search by name/email/subject
- Export to CSV

### 8.3 Spam Prevention

- reCAPTCHA v3 (invisible, scored)
- Honeypot field (hidden from humans)

---

## 9. Authentication & Access Control

### 9.1 Authentication
- NextAuth v4 with GitHub OAuth provider
- JWT session strategy (no database)
- All `/admin/*` routes protected by layout-level `getServerSession()`
- Callback URLs: `http://localhost:3000/api/auth/callback/github` (dev) / `https://o4ainnovations.com/api/auth/callback/github` (prod)

### 9.2 Access Control (`/admin/access`)
- List of authorized GitHub usernames stored in Sanity (`authorizedUser` type)
- Roles: Admin (full access including settings + access control) vs Editor (content only)
- Admin layout checks: `session.user.login` must be in authorized users list
- Add/remove users from `/admin/access`
- Last login timestamp per user

---

## 10. SEO Architecture

### 10.1 Dynamic Per-Page SEO
A shared library at `src/lib/seo/` generates all metadata, JSON-LD, OpenGraph, and Twitter Cards dynamically per page.

### 10.2 Per-Page Output
| Element | Source |
|---|---|
| Title | `seo.metaTitle` (dedicated field) or document title |
| Description | `seo.metaDescription` (dedicated field) |
| Canonical URL | Auto-generated from slug |
| OpenGraph (24 tags) | Per-page with image override |
| Twitter Card | `summary_large_image` with per-page image |
| JSON-LD | Corporation, WebSite, BreadcrumbList, NewsArticle, Person, JobPosting |
| Robots | `seo.noindex` toggle |
| Keywords | `seo.keywords` array |

### 10.3 Sitemap Infrastructure
- Sitemap index → standard + news (last 2 days press releases) + image sitemaps
- Priority + changefreq + real `lastmod` from Sanity
- Robots.txt with GPTBot block + sitemap index references

---

## 11. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| CMS | Sanity (cloud, headless) |
| Auth | NextAuth v4 (GitHub OAuth, JWT) |
| Email | Resend |
| Spam | reCAPTCHA v3 |
| Deployment | Vercel |
| DNS/CDN | Cloudflare |
| Analytics | Google Analytics 4 |
| Icons | Lucide React |
| Fonts | Playfair Display, Lora, Inter, JetBrains Mono (via next/font) |

---

## 12. Assets

| File | Location | Purpose |
|---|---|---|
| `icon.png` (925KB, 2043×2043) | `public/` | Primary favicon |
| `favicon.ico` (4KB, 32×32) | `public/` | Legacy fallback |
| `apple-touch-icon.png` (23KB, 180×180) | `public/` | Apple home screen |
| `icon-192.png` (25KB, 192×192) | `public/` | PWA home screen |
| `icon-512.png` (92KB, 512×512) | `public/` | PWA splash |
| `icon-mask.png` (92KB, 512×512) | `public/` | Android adaptive |
| `manifest.webmanifest` | `public/` | PWA manifest |
| `o4a.png` (128KB, 1200×630) | `public/images/og/` | OG social share |

All derived from `icon.png` using Lanczos3 resampling. Original preserved. No SVG — PNG used directly as primary favicon.

---

## 13. Implementation Status

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Critical fixes (9 items) | ✅ Complete |
| Phase 2 | Infrastructure (middleware, security headers, skeleton) | ✅ Complete |
| Phase 3 | Missing routes + loading states (10 files) | ✅ Complete |
| Phase 4 | Sanity Studio embed (5 files) | ✅ Complete |
| Phase 5 | SEO library | Not started |
| Phase 6 | Apply SEO to all pages | Not started |
| Phase 7 | Sitemap upgrades | Not started |
| Phase 8 | CMS content migration | Not started |
| Phase 9 | Enterprise admin rebuild | Not started |
| Phase 10 | Performance polish + credential rotation | Not started |

---

## 14. Key Decisions

1. **Templates hardcoded, content from Sanity.** No hardcoded text in any template.
2. **Flat named fields** in editor, not page builder blocks. First-time editor friendly.
3. **Only `[slug]` templates** create new pages. Static pages are fixed.
4. **Auto-propagation** for listing pages — editors never edit them manually.
5. **All media through `/admin/media`** — single source of truth with permissions.
6. **`/hello` permission gate** — shared between assets and pages.
7. **No Formspree** — contact submissions stored in Sanity, email via Resend.
8. **Dedicated SEO fields** per document — not auto-derived from content body.
9. **Admin-driven by public pages**, not Sanity document types.
10. **Single theme** — no dark mode, no rounded corners.
