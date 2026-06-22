# O4A — Full System Audit Report

Comprehensive audit of all 45 routes, 100+ source files. Ran June 2026.

---

## CRITICAL (1)

### C1: Admin Editor Content Disconnect — Public Pages Never Read Admin Content

The admin saves content to `pageContent` Sanity documents. None of the public-facing pages fetch these documents. Admin edits are silently discarded.

| Page | Admin Saves To | Public Reads From | Result |
|---|---|---|---|
| Homepage `/` | `pageContent` slug `"home"` — companyName, tagline, 6 nav link labels | Hardcoded in `page.tsx`, `navbar.tsx`, `footer.tsx` | Admin edits have zero effect |
| About `/about` | `pageContent` slug `"about"` — missionText, timeline, sidebar fields | Hardcoded JSX in `about/page.tsx` | Admin edits have zero effect |
| Investors `/investors` | `pageContent` slug `"investors"` — ownership, governance, financial text, contact info | Hardcoded JSX in `investors/page.tsx` | Admin edits have zero effect |
| News `/news` | `pageContent` slug `"news"` — introText, media contact info | Hardcoded JSX in `news/page.tsx` | Admin edits have zero effect |
| Careers `/careers` | `pageContent` slug `"careers"` — whyO4A, values, hiring process | Hardcoded JSX in `careers/page.tsx` | Admin edits have zero effect |
| Contact `/contact` | `pageContent` slug `"contact"` — emails, office, intro | Hardcoded JSX in `contact/page.tsx` | Admin edits have zero effect |
| ESG `/esg` | `pageContent` slug `"esg"` — all 4 sections | Hardcoded JSX in `esg/page.tsx` | Admin edits have zero effect |
| Legal `/legal` | SEO only — no body fields exist in editor | Hardcoded JSX in `legal/page.tsx` | Not affected (no body fields) |
| Portfolio `/portfolio` | `pageContent` slug `"portfolio"` — introText | Hardcoded JSX in `portfolio/page.tsx` | Admin edits have zero effect |

**Root cause:** The public page templates were built first with hardcoded content. Admin editors were built later but the templates were never updated to fetch `pageContent` documents from Sanity.

**What pages work correctly:** Only pages that use dedicated Sanity document types work — `subsidiary` (portfolio listing/details), `teamMember` (about team section), `pressRelease` (news listing/details), `download` (investors downloads widget), `job` (careers/jobs listing/details).

---

## HIGH (13)

### H1: Investors Editor — 8 Body Fields Are Dead UI

**File:** `src/app/(admin)/editor/investors/page.tsx`

The GROQ query fetches only `{_id,title,seo}` — never `body`. `handleSave()` sends only `seo`. 8 form fields exist in the UI but are never loaded from or saved to Sanity.

**Dead fields:** ownershipHeading, ownershipBody, governanceHeading, governanceBody, financialHeading, financialBody, contactEmail, contactResponse

### H2: About Editor — 7 Body Fields Are Dead UI

**File:** `src/app/(admin)/editor/about/page.tsx`

Same pattern. GROQ: `{_id,title,seo}`. Save: `{seo}`. No body.

**Dead fields:** missionText, timelineYear, timelineTitle, timelineDesc, foundedYear, headquarters, structure

### H3: Contact Editor — 6 Body Fields Are Dead UI

**File:** `src/app/(admin)/editor/contact/page.tsx`

Same pattern. GROQ: `{_id,seo}`. Save: `{seo}`. No body.

**Dead fields:** introText, generalEmail, pressEmail, investorsEmail, partnershipsEmail, officeLocation

### H4: News Editor — 3 Body Fields Are Dead UI

**File:** `src/app/(admin)/editor/news/page.tsx`

Same pattern. GROQ: `{_id,title,seo}`. Save: `{seo}`. No body.

**Dead fields:** introText, mediaContactEmail, mediaKitMessage

### H5: Portfolio Editor — 1 Body Field Is Dead UI

**File:** `src/app/(admin)/editor/portfolio/page.tsx`

Same pattern. GROQ: `{_id,title,seo}`. Save: `{seo}`. No body.

**Dead field:** introText

### H6: Homepage Ignores Admin Content Entirely

**Files:** `src/app/page.tsx`, `src/components/layout/navbar.tsx`, `src/components/layout/footer.tsx`

Company name "O4A", tagline "A holding company. Building and operating businesses.", and all 6 navigation link labels are hardcoded. The admin home editor saves `companyName`, `tagline`, `portfolioLabel`, `aboutLabel`, `investorsLabel`, `newsLabel`, `careersLabel`, `contactLabel` to `pageContent` slug `"home"` — but the public page, navbar, and footer never fetch this document.

### H7: Careers Page Has Hardcoded Empty Jobs Array

**File:** `src/app/careers/page.tsx` (line 13)

`const allJobs: JobListing[] = []` — always shows "No open positions at this time." Should fetch active `job` documents from Sanity like `/careers/jobs/page.tsx` does.

### H8: About Timeline Says 2024, SEO Constants Say 2026

**Files:** `src/app/about/page.tsx` (lines 27-34) vs `src/lib/seo/constants.ts` (line 9)

Timeline events hardcoded: `{ year: "2024", title: "O4A Founded" }`. SEO constants: `foundingDate: "2026"`. The Corporation JSON-LD schema emitted on the homepage embeds `foundingDate: "2026"`. Public contradiction.

### H9: Investors Page — All Text Hardcoded Despite Admin Editor

**File:** `src/app/investors/page.tsx`

Ownership text, governance text, financial overview text, investor contact email, response time — all hardcoded in JSX. Admin editor saves these fields to Sanity but the page never reads them.

### H10: About Page — Mission, Timeline, Stats Hardcoded

**File:** `src/app/about/page.tsx`

Mission text (3 paragraphs), timeline events, stat counter values, sidebar key figures — all hardcoded. Admin editor has fields for all of these.

### H11: Contact Page — All Sidebar Info Hardcoded

**File:** `src/app/contact/page.tsx`

All 4 email addresses, office location, intro text — hardcoded. Admin editor saves these fields.

### H12: ESG Page — All 4 Sections Hardcoded

**File:** `src/app/esg/page.tsx`

Commitment, Environmental, Social, Governance text — all hardcoded JSX. Admin editor saves to `pageContent`.

### H13: Careers Page — Culture Text Hardcoded

**File:** `src/app/careers/page.tsx`

"Why O4A" text, 4 values, hiring process text — all hardcoded. Admin editor saves these fields.

---

## MEDIUM-HIGH (2)

### MH1: Zero Error Handling in All 11 Server Actions

**Files:** All 11 files in `src/lib/actions/` (access.ts, contact.ts, download.ts, job.ts, media.ts, messages.ts, page-content.ts, press.ts, settings.ts, subsidiary.ts, team.ts)

No `try/catch` blocks exist. If Sanity API fails (network error, invalid token, schema mismatch, permission error), the exception propagates unhandled to the client. Client-side callers do wrap in `try/catch`, but no meaningful error messages or logging exist on the server side.

### MH2: Admin Access Not Gated by `authorizedUser` List

**Files:** `src/app/(admin)/layout.tsx` (lines 10-14) vs `src/app/(admin)/access/page.tsx` (line 99)

The admin layout only checks `session?.user` — any GitHub-authenticated user gains access. The access page states: *"Only GitHub users listed below can access the admin panel"* — but this is never enforced. The `authorizedUser` documents are managed (add/remove/role-change) but the layout never queries Sanity to check if `session.user.login` is in the authorized list.

---

## MEDIUM (10)

### M1: Canonical URLs Missing on Dynamic Pages

**Files:** `src/app/portfolio/[slug]/page.tsx`, `src/app/news/[slug]/page.tsx`, `src/app/careers/jobs/[slug]/page.tsx`, `src/app/layout.tsx`

No `alternates: { canonical: url }` is set in any `generateMetadata` function or the root layout. Dynamic detail pages should set their own canonical URL.

### M2: Sanity Write Client Uses `SANITY_API_READ_TOKEN`

**File:** `src/lib/sanity.ts` (line 6, 22)

The environment variable is named `SANITY_API_READ_TOKEN` (suggesting read-only), but it is assigned to the write client. In Sanity, read tokens lack write permissions. If the token is truly read-only, all admin mutations will fail with opaque errors.

### M3: `sanityFetch` Silently Swallows Errors

**File:** `src/lib/sanity.ts` (line 53)

`catch (error) { console.error(...); return [] as unknown as T; }` — Any fetch error returns an empty array. Pages render as "no data" instead of showing an error state. A broken Sanity connection means the entire site shows empty content with no indication of failure.

### M4: `revalidateTag` Uses `"default"` Profile — Should Be `"max"`

**Files:** 8 action files, 20+ `revalidateTag` calls

The Next.js 16 signature is `revalidateTag(tag: string, profile: string | CacheLifeConfig)`. The documented valid profile is `"max"`. Using `"default"` may cause the revalidation to NOT set `pathWasRevalidated`, meaning read-your-own-writes does not work — after a mutation, re-fetching returns stale cached data.

### M5: Zod Validation Schemas Exist But Are Never Used

**Files:** 6 schema files in `src/lib/validations/`

All 6 Zod schemas (subsidiary, team, press, job, contact, settings) are well-written but dead code. No server action imports or calls `.parse()` on them. The client-side contact form extracts raw values from `FormData`. Data enters Sanity with zero server-side validation.

### M6: Investors Editor Missing Download Document Management

**File:** `src/app/(admin)/editor/page.tsx` (line 11 — index describes "downloads") vs `src/app/(admin)/editor/investors/page.tsx` (no download CRUD)

The editor index describes the investors editor as: "Governance text, downloads, and contact." But the editor has no download upload/delete/list UI. Downloads can only be managed through the media library or Sanity Studio directly.

### M7: Press Release Editor Missing Body/Content Field

**File:** `src/app/(admin)/editor/news/page.tsx`

The press release create/edit form has fields for title, slug, category, and featured — but no body/content field. Press releases created through the admin will have no text content. An editor must open Sanity Studio to add the actual release body.

### M8: No Global `robots` Default in Root Layout

**File:** `src/app/layout.tsx`

The root layout metadata has no `robots` entry. Individual pages set their own (`legal` = noindex, `not-found` = noindex), but a global `robots: { index: true, follow: true }` default is standard enterprise practice.

### M9: Google Analytics Rendered After `</body>`

**File:** `src/app/layout.tsx` (lines 77-79)

The `<GoogleAnalytics>` component renders as a sibling to `<body>` inside `<html>`, not inside `<body>`. Next.js `@next/third-parties` documentation shows placement inside the body. May work but is non-standard.

### M10: Contact and Legal Editors Missing Loading State

**Files:** `src/app/(admin)/editor/contact/page.tsx`, `src/app/(admin)/editor/legal/page.tsx`

Both use `.then()` for data fetching without a `loading` state variable. The form renders immediately with empty/default values while data loads from Sanity — causing a brief flash of blank fields.

---

## LOW (12)

### L1: `useScroll` Hook Never Imported

**File:** `src/hooks/use-scroll.ts`

Exported but never imported anywhere in the codebase. Dead code.

### L2: Access Page Has Redundant Duplicate Data Fetch

**File:** `src/app/(admin)/access/page.tsx` (lines 24-46)

`fetchUsers` is defined as a `useCallback` for refresh purposes. The initial load uses a separate inline `useEffect` with its own duplicate Sanity fetch. Both do the exact same query. The `useEffect` could simply call `fetchUsers()`.

### L3: API Token Not `NEXT_PUBLIC_` Prefixed

**File:** `src/lib/sanity.ts` (line 6)

`SANITY_API_READ_TOKEN` lacks `NEXT_PUBLIC_` prefix. Safe currently (only used in `"use server"` files), but fragile — a future client-side import would silently produce `undefined`.

### L4: Admin Media Page Uses `<img>` With eslint-disable

**File:** `src/app/(admin)/media/page.tsx` (line 273)

Uses `<img>` for Sanity CDN image display with `/* eslint-disable @next/next/no-img-element */`. Justified (CDN images with dynamic URLs, unknown dimensions), but the suppression should be documented with a comment explaining why.

### L5: Contact/Messages/Media Actions Don't Call `revalidateTag`

**Files:** `src/lib/actions/contact.ts`, `src/lib/actions/messages.ts`, `src/lib/actions/media.ts`

These actions mutate Sanity documents but never revalidate. Currently fine because consumers use client-side refetching or direct API routes without cache tags.

### L6: Media API Routes Use `match` Instead of `==` for Filename Matching

**Files:** All 4 routes in `src/app/api/media/`

GROQ query: `originalFilename match $slug`. The `match` operator does pattern/substring matching. Two files named `report-2024.pdf` and `report-2024-summary.pdf` could both match `report-2024.pdf`. `==` would give exact matching.

### L7: `subject` Field Required in HTML Form But Optional in Server Action

**Files:** `src/components/sections/contact-form.tsx` (line 102, `required`) vs `src/lib/actions/contact.ts` (line 9, `subject?: string`)

HTML form marks subject as required. Server action declares it optional. Sanity schema also has it as optional. Minor inconsistency.

### L8: Career Editor Has Inconsistent State Pattern

**File:** `src/app/(admin)/editor/careers/page.tsx` (lines 52-61)

Job form uses a single state object (`const [jobForm, setJobForm] = useState({...})`) instead of individual `useState` variables. All other editors with CRUD (about/team, news/press, portfolio/subsidiaries) use individual state variables per field.

### L9: About Editor Has Redundant Duplicate Save Button

**File:** `src/app/(admin)/editor/about/page.tsx` (lines 467-476)

A second "Save" button exists at the bottom of the form, separate from the one in the page header. Both call the same `handleSave`. No other editor has this duplicate.

### L10: `sanityFetch` Used Inside `"use client"` Component

**File:** `src/app/(admin)/admin/messages/page.tsx`

`sanityFetch` is called from a `"use client"` component. The function sets `cache: "force-cache"` and `next: { tags, revalidate }` — but in a client component, there is no Next.js server cache layer. These options are silently ignored. Data arrives but caching intent is lost.

### L11: Missing `X-XSS-Protection` Header

**File:** `next.config.ts`

CSP is comprehensive but `X-XSS-Protection: "1; mode=block"` is missing. Mostly deprecated for modern browsers but still protects older clients.

### L12: 7 Files Use Raw `<a>` Tags Instead of `<Link>`

**Files:** `legal/page.tsx` (hash links), `news/[slug]/page.tsx` (PDF), `careers/jobs/[slug]/page.tsx` (external apply URL), `portfolio/[slug]/page.tsx` (subsidiary URL), `c/[slug]/page.tsx`, `doc/[slug]/page.tsx`, `components/blog/post-body.tsx`

All justified — external URLs, file downloads, same-page hash links, or PortableText renderer links. Not a bug, but worth documenting.

---

## Editor Pages Audit — What Works vs What's Broken

### Working Correctly (3 of 9 editors)

| Editor | Body Fields | Save | CRUD for Documents |
|---|---|---|---|
| **Careers** | whyO4A, values 1-4, hiring steps — fetched + saved | ✅ | Jobs: create/edit/delete |
| **ESG** | All 4 section texts — fetched + saved | ✅ | None needed |
| **Home** | companyName, tagline, 6 nav labels — fetched + saved | ✅ | None needed |

### Broken (5 of 9 editors)

| Editor | Body Fields | Save | CRUD for Documents |
|---|---|---|---|
| **Investors** | 8 fields exist in UI, NEVER fetched or saved | ❌ body missing | None (downloads missing) |
| **About** | 7 fields exist in UI, NEVER fetched or saved | ❌ body missing | Team: create/edit/delete ✅ |
| **Contact** | 6 fields exist in UI, NEVER fetched or saved | ❌ body missing | None needed |
| **News** | 3 fields exist in UI, NEVER fetched or saved | ❌ body missing | Press: create/edit/delete ✅ (but no body field in form) |
| **Portfolio** | 1 field exists in UI, NEVER fetched or saved | ❌ body missing | Subsidiaries: create/edit/delete ✅ |

### Partial (1 of 9 editors)

| Editor | Body Fields | Save |
|---|---|---|
| **Legal** | No body fields (only SEO + noindex toggle + informational section list) | ✅ SEO saves correctly |

---

## Verified Correct (No Issues Found)

| Area | Verdict |
|---|---|
| All `"use client"` / `"use server"` directives | Correct — 33 client components, 12 server actions |
| All `toast` from `sonner` imports | Correct in 11 files |
| All `process.env.NEXT_PUBLIC_` usage | Correct — only public vars in client components |
| All 10 Sanity schema types in Studio config | All imported correctly |
| All `revalidateTag` tags match Sanity document types | Consistent across actions and queries |
| NextAuth config | Correct — GitHub OAuth, JWT, signOut redirect to `/` |
| All `<Link>` usage (except justified `<a>` tags) | Correct |
| `next/image` usage in public pages | All 3 components using it correctly |
| Fragment wrappers (`<>...</>`) | All properly closed |
| SEO schemas (JsonLd, BreadcrumbSchema) | Correct placement on all pages |
| `robots` directives | Legal=noindex, not-found=noindex, hello=noindex/nofollow |

---

## Summary Table

| Severity | Count | Categories |
|---|---|---|
| **CRITICAL** | 1 | Admin-public content disconnect |
| **HIGH** | 13 | Dead UI in 5 editors, hardcoded content in public pages, founding date inconsistency |
| **MEDIUM-HIGH** | 2 | No error handling in server actions, admin access not enforced |
| **MEDIUM** | 10 | Missing canonicals, misnamed token, Zod unused, wrong revalidateTag profile, missing features |
| **LOW** | 12 | Dead code, inconsistent patterns, minor config issues |
| **TOTAL** | **38** | |

---

## Priority Fix Order

1. **Fix the admin-public disconnect (C1 + H1-H13)** — Wire `pageContent` Sanity documents to public page templates. This unlocks ALL admin editors.

2. **Fix dead UI in broken editors (H1-H5)** — Add `body` to GROQ queries and `handleSave()` in investors, about, contact, news, portfolio editors.

3. **Enforce admin access (MH2)** — Add `authorizedUser` list check to admin layout.

4. **Fix `revalidateTag` profile (M4)** — Change `"default"` to `"max"` in all 20+ calls.

5. **Wire Zod validation (M5)** — Import and call `.safeParse()` in server actions.

6. **Add error handling to server actions (MH1)** — Wrap all Sanity mutations in `try/catch`.

7. **Add canonical URLs (M1)** — Set `alternates.canonical` in `generateMetadata` for dynamic pages.

8. **Fix Careers page (H7)** — Fetch jobs from Sanity instead of hardcoded empty array.

9. **Fix About founding date (H8)** — Align timeline with SEO constants (2026).

10. **Add download management to Investors editor (M6)**.

11. **Add body field to Press Release editor (M7)**.

12. **Clean up LOW issues (L1-L12)** — Remove dead code, fix minor inconsistencies.
