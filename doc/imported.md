# Imported vs Custom — Final Architecture

## Source Categories

| Category | Definition | Examples |
|---|---|---|
| **Package Import** | Installed via npm, zero code written | `next`, `framer-motion`, `shadcn/ui` components |
| **Generated** | Created by CLI tool (`npx shadcn add`, `npx create-next-app`) | `button.tsx`, `card.tsx`, `skeleton.tsx`, `sonner.tsx` |
| **Config** | Wiring existing tools with credentials/env | `sanity.ts`, `auth.ts`, `next.config.ts`, `sanity.config.ts` |
| **Custom Built** | Written specifically for O4A — unique to this project | All page components, globals.css, animation wrappers, section components, admin pages |

---

## Imported Packages

| Package | Purpose |
|---|---|
| `next` | Framework |
| `react` / `react-dom` | UI library |
| `typescript` | Type checking |
| `tailwindcss` | Styling engine |
| `framer-motion` | Animation library |
| `next-auth` | Authentication |
| `@sanity/client` | Sanity API client |
| `@sanity/image-url` | Image URL builder |
| `next-sanity` | Next.js + Sanity integration + Studio embed |
| `sanity` | Sanity Studio |
| `@sanity/vision` | Sanity GROQ playground |
| `@next/third-parties` | Google Analytics component |
| `sonner` | Toast notifications |
| `lucide-react` | Icon library |
| `@portabletext/react` | Sanity rich text renderer |
| `clsx` / `tailwind-merge` | Classname utilities |
| `sharp` | Image processing (used for favicon generation) |
| `to-ico` | ICO file generation |

---

## Generated Components (shadcn/ui — `npx shadcn add`)

| Component | File |
|---|---|
| button | `src/components/ui/button.tsx` |
| card | `src/components/ui/card.tsx` |
| input | `src/components/ui/input.tsx` |
| textarea | `src/components/ui/textarea.tsx` |
| badge | `src/components/ui/badge.tsx` |
| table | `src/components/ui/table.tsx` |
| dialog | `src/components/ui/dialog.tsx` |
| sheet | `src/components/ui/sheet.tsx` |
| separator | `src/components/ui/separator.tsx` |
| dropdown-menu | `src/components/ui/dropdown-menu.tsx` |
| avatar | `src/components/ui/avatar.tsx` |
| sonner | `src/components/ui/sonner.tsx` |
| skeleton | `src/components/ui/skeleton.tsx` |

---

## Config / Wiring Files

| File | What it wires | Custom code? |
|---|---|---|
| `sanity.config.ts` | Sanity Studio configuration — imports 5 schemas, sets project ID, plugins | 90% config, 10% custom (schema imports) |
| `sanity.cli.ts` | Sanity CLI configuration | 100% config |
| `next.config.ts` | Security headers, image remotePatterns | 60% custom CSP string, 40% config |
| `components.json` | shadcn/ui integration config | 100% generated |
| `src/lib/sanity.ts` | Sanity client + fetch wrapper + URL builder | 50% config, 50% custom (error handling wrapper) |
| `src/lib/auth.ts` | NextAuth configuration — GitHub provider, JWT, session helper | 70% config, 30% custom (provider setup) |
| `src/lib/signout-action.ts` | Server action for admin sign-out | Custom (5 lines) |
| `src/lib/utils.ts` | `cn()` classnames helper | 100% generated |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth route handler | 100% config |
| `.env.local` | Environment variables | 100% config |

---

## Custom Built — Unique to O4A

### Design System

| File | Purpose | Lines |
|---|---|---|
| `src/app/globals.css` | Entire sepia design system — 13 CSS variables, card depth system, border rules, paper texture, typography base styles, utility classes | ~250 |

### Layout Shell

| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout — fonts, metadata, auth provider, theme provider, GA, toaster, nav + footer |
| `src/components/layout/navbar.tsx` | Public nav — responsive, mobile sheet menu, active link indicator |
| `src/components/layout/footer.tsx` | Footer — double-rule divider, column links, copyright |
| `src/components/providers/auth-provider.tsx` | SessionProvider wrapper |
| `src/components/providers/theme-provider.tsx` | Paper texture injection |

### Animation Wrappers

| File | Purpose |
|---|---|
| `src/components/animations/fade-in.tsx` | Fade + translateY on mount |
| `src/components/animations/stagger.tsx` | Staggered children with container variants |
| `src/components/animations/scroll-reveal.tsx` | Fade in on scroll (useInView) |
| `src/components/animations/count-up.tsx` | Animated number counter (useSpring) |

### Section Components

| File | Purpose |
|---|---|
| `src/components/sections/subsidiary-card.tsx` | Portfolio company card with status badge, industry, external link |
| `src/components/sections/team-card.tsx` | Team member card with photo, name, title, bio |
| `src/components/sections/timeline.tsx` | Vertical timeline with dots, dates, events |
| `src/components/sections/press-list.tsx` | Press release list with year filter tabs |
| `src/components/sections/job-card.tsx` | Job listing card with location, type, subsidiary badges |
| `src/components/sections/download-list.tsx` | Download file list grouped by category |
| `src/components/sections/stat-counter.tsx` | Stats grid with animated counters |
| `src/components/sections/contact-form.tsx` | Contact form with category selector, validation, toast feedback |
| `src/components/blog/post-body.tsx` | Portable Text renderer for Sanity rich text |

### Public Pages (13 page components)

| File | Type |
|---|---|
| `src/app/page.tsx` | Homepage (abc.xyz minimal) |
| `src/app/portfolio/page.tsx` | Portfolio listing |
| `src/app/portfolio/[slug]/page.tsx` | Subsidiary detail |
| `src/app/about/page.tsx` | About (mission, timeline, team, stats) |
| `src/app/investors/page.tsx` | Investor Relations |
| `src/app/news/page.tsx` | Newsroom |
| `src/app/news/[slug]/page.tsx` | Press release detail |
| `src/app/careers/page.tsx` | Careers (values, why O4A, hiring process) |
| `src/app/contact/page.tsx` | Contact (form + email sidebar) |
| `src/app/legal/page.tsx` | Legal (5 sections) |
| `src/app/esg/page.tsx` | ESG (4 sections) |
| `src/app/not-found.tsx` | 404 |
| `src/app/error.tsx` | Error boundary |

### Admin Pages (8 components)

| File | Purpose |
|---|---|
| `src/app/(admin)/layout.tsx` | Admin auth guard |
| `src/app/(admin)/navbar.tsx` | Admin navigation (7 links + sign out) |
| `src/app/(admin)/admin/page.tsx` | Dashboard — stats, recent press, messages |
| `src/app/(admin)/admin/subsidiaries/page.tsx` | Subsidiary list |
| `src/app/(admin)/admin/team/page.tsx` | Team list |
| `src/app/(admin)/admin/press/page.tsx` | Press list |
| `src/app/(admin)/admin/downloads/page.tsx` | Downloads list |
| `src/app/(admin)/admin/pages/page.tsx` | Page content list |
| `src/app/(admin)/admin/messages/page.tsx` | Messages (Formspree link) |
| `src/app/(admin)/studio/[[...index]]/page.tsx` | Sanity Studio embed |

### Loading States (6 files)

| File |
|---|
| `src/app/loading.tsx` |
| `src/app/portfolio/loading.tsx` |
| `src/app/about/loading.tsx` |
| `src/app/news/loading.tsx` |
| `src/app/investors/loading.tsx` |
| `src/app/(admin)/loading.tsx` |

### Core Libraries

| File | Purpose |
|---|---|
| `src/types/index.ts` | TypeScript interfaces for all Sanity document types |
| `src/hooks/use-scroll.ts` | Scroll position detection hook |

### Sanity Schemas (5 files)

| File | Document Type |
|---|---|
| `src/lib/sanity-schemas/subsidiary.ts` | `subsidiary` |
| `src/lib/sanity-schemas/team-member.ts` | `teamMember` |
| `src/lib/sanity-schemas/press-release.ts` | `pressRelease` |
| `src/lib/sanity-schemas/download.ts` | `download` |
| `src/lib/sanity-schemas/page-content.ts` | `pageContent` |

### SEO Utilities

| File | Purpose |
|---|---|
| `src/app/sitemap.ts` | Dynamic sitemap XML |
| `src/app/robots.ts` | Robots.txt |

---

## Not Yet Built (Planned — Custom)

| Category | Files | Purpose |
|---|---|---|
| **Admin CRUD pages** | `src/app/(admin)/editor/*`, `src/app/(admin)/media/*`, `src/app/(admin)/settings/*`, `src/app/(admin)/access/*` | Enterprise admin replacing current read-only viewer |
| **Server actions** | `src/lib/actions/subsidiary.ts`, `team.ts`, `press.ts`, `download.ts`, `page-content.ts`, `media.ts`, `contact.ts`, `messages.ts`, `settings.ts`, `access.ts` | CRUD operations calling Sanity write API |
| **Validation schemas** | `src/lib/validations/*.ts` | Zod schemas for all server action inputs |
| **SEO library** | `src/lib/seo/constants.ts`, `types.ts`, `metadata.ts`, `structured-data.ts`, `components/json-ld.tsx`, `components/breadcrumb.tsx`, `index.ts` | Dynamic enterprise SEO per page |
| **Public pages** | `src/app/careers/jobs/page.tsx`, `src/app/careers/jobs/[slug]/page.tsx`, `src/app/hello/page.tsx`, `src/app/img/[slug]/page.tsx`, `src/app/vid/[slug]/page.tsx`, `src/app/doc/[slug]/page.tsx`, `src/app/c/[slug]/page.tsx` | Missing routes |
| **Sitemap routes** | `src/app/sitemap-index.xml/route.ts`, `src/app/sitemap-news.xml/route.ts` | Enterprise sitemap infrastructure |
| **Sanity schemas** | `src/lib/sanity-schemas/job.ts`, `contact-submission.ts`, `site-settings.ts`, `authorized-user.ts`, `seo.ts`, `media-asset.ts` | New document types for full architecture |

---

## Summary

| Category | Count | Status |
|---|---|---|
| Package imports | 18 | ✅ Installed |
| shadcn generated | 13 | ✅ Installed |
| Config files | 11 | ✅ Done |
| Custom built (existing) | ~50 | ✅ Built |
| Custom built (planned) | ~50 | ❌ Not started |

**When complete:** ~100 custom files + 18 packages + 13 generated = full enterprise holding company website.
