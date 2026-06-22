<p align="center">
  <img src="public/icon.png" alt="O4A" width="120" />
</p>

<h1 align="center">O4A Innovations</h1>

<p align="center">
  <strong>A holding company. Building the Technologies that power the future.</strong>
</p>

<p align="center">
  <a href="https://o4ainnovations.com"><strong>o4ainnovations.com</strong></a>
</p>

---

## Overview

The official corporate website for O4A Innovations — a holding company that builds, operates, and invests in companies, products, and projects. Built as a frontend-only SSR application deployed on Vercel with Sanity as the headless CMS.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Animations** | Framer Motion |
| **CMS** | Sanity (cloud, headless) |
| **Auth** | NextAuth v4 (GitHub OAuth, JWT) |
| **Database** | Sanity Cloud (8 document types) |
| **Deployment** | Vercel |
| **DNS/CDN** | Cloudflare |
| **Analytics** | Google Analytics 4 |
| **Fonts** | Playfair Display, Lora, Inter, JetBrains Mono |

## Design System — Antique Press

A print-first, enterprise-grade design system inspired by antique newspapers and premium editorial publications (The New York Times, The Economist). Single intentional theme — no dark mode. No rounded corners.

| Element | Hex |
|---|---|
| Paper background | `#F4EBD9` |
| Sepia ink | `#3C2317` |
| Body text | `#2C2420` |
| Gold accent | `#C9A96E` |

## Site Structure

### Public Pages (14 routes)

| Route | Description |
|---|---|
| `/` | Homepage — abc.xyz minimal |
| `/portfolio` | Portfolio listing — all subsidiaries |
| `/portfolio/[slug]` | Subsidiary detail |
| `/about` | Mission, timeline, leadership, board |
| `/investors` | Governance, financials, downloads |
| `/news` | Press release listing |
| `/news/[slug]` | Press release detail |
| `/careers` | Culture, values, hiring process |
| `/careers/jobs` | Open positions |
| `/careers/jobs/[slug]` | Job detail |
| `/contact` | Contact form |
| `/legal` | Privacy, terms, cookies, GDPR, whistleblower |
| `/esg` | Environmental, social, governance |

### Admin Pages (authenticated)

| Route | Description |
|---|---|
| `/admin` | Dashboard — stats, activity, quick actions |
| `/admin/editor` | Content editor — all public pages |
| `/admin/editor/[page]` | Per-page editor — flat named fields |
| `/admin/media` | Media library |
| `/admin/messages` | Contact form inbox |
| `/admin/settings` | Company settings |
| `/admin/access` | Team access control |
| `/studio` | Sanity CMS Studio |

## Getting Started

### Prerequisites

- Node.js 22+
- Sanity account + project
- GitHub OAuth app
- Google Analytics property

### Installation

```bash
git clone git@github.com:o4ainnovations/root.git
cd root
npm install
```

### Environment Variables

Copy `.env.local` (not committed — kept in `.gitignore`):

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=

# NextAuth
GITHUB_ID=
GITHUB_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Google Analytics
NEXT_PUBLIC_GA_ID=
```

### Development

```bash
npm run dev
# Opens http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
# 0 errors, 0 warnings
```

## Architecture

```
Content Editors → /admin/editor → Server Actions → Sanity Cloud
                                                    ↓
                                              ISR Revalidation
                                                    ↓
Visitors → / (public pages) ← fetch ← Sanity CDN (cached)
```

Templates are hardcoded in code (layout, grid, animations). All content comes from Sanity. Zero hardcoded text in templates.

## Documentation

Detailed project documentation available in [doc/](doc/):

| Document | Content |
|---|---|
| [product-spec.md](doc/product-spec.md) | Full product specification and architecture |
| [update.md](doc/update.md) | System audit and implementation phases |
| [seo.md](doc/seo.md) | Enterprise SEO library design |
| [imported.md](doc/imported.md) | Imported vs custom component breakdown |
| [temp.md](doc/temp.md) | Deep audit findings and fixes |

## License

Copyright © 2026 O4A Innovations Ltd. All rights reserved.
