# EYEOCEAN — Technical Reference Document

Status snapshot as of **2026-10-01**. This document exists so work can resume
from exactly this point later without re-deriving context. It covers the
platform as a whole, then the in-progress design refresh.

---

## 1. What this is

EYEOCEAN is a multi-category luxury commerce platform (Fashion, Jewelry,
Beauty, Technology, Art, Lifestyle) — a Next.js/React rebuild of what was
originally a single-product static site. It is a real, working application
(real database, real auth, real Stripe test-mode checkout), not a mockup,
but the product catalog itself is placeholder/demo data throughout — the
site banners this ("Preview build — product data, search and checkout are
placeholders, not live").

## 2. Architecture

- **Framework**: Next.js 16 (App Router, Turbopack), TypeScript, Tailwind v4
  (CSS-based `@theme`, not `tailwind.config.js`).
- **Database**: PostgreSQL via Prisma ORM. Local dev uses Docker Postgres;
  production uses Neon (provisioned through Vercel's Storage/Marketplace
  integration). See §5 for a critical constraint on this.
- **Search**: Meilisearch, proxied through `/api/search` so credentials
  never reach the client. Hosted on **Meilisearch Cloud free trial**
  (14 days from 2026-09-30, i.e. expires **2026-10-14** — a reminder is
  scheduled for 2026-10-11). If the trial lapses, `/api/search` degrades to
  a clean `503` rather than crashing.
- **Auth**: Custom — `crypto.scrypt` password hashing, HMAC-SHA256 signed
  session cookies. No external auth provider.
- **Payments**: Stripe Checkout, **test mode only**. Server-side re-pricing,
  webhook signature verification. Going live requires the account owner to
  complete Stripe's business/identity verification (this was started and
  intentionally paused — see §6) and a live-mode webhook endpoint.
- **Hosting**: Vercel, GitHub-connected for auto-deploy on push to `main`.
  `package.json`'s `vercel-build` script runs
  `prisma generate && prisma migrate deploy && prisma db seed && next build`
  so every deploy migrates and seeds automatically.

## 3. Repository / deployment state

- **GitHub**: `seemabhassan515/eyeocean-platform`, `main` branch.
- **Production**: https://eyeocean-platform.vercel.app — auto-deploys from
  `main`. Verified working: homepage, category/brand/product/journal pages,
  auth, checkout (test mode), Stripe webhook, search, security headers,
  proper 404s on unknown slugs.
- **This design work lives entirely on a separate branch, `design-refresh`,
  and has never been merged into `main`.** Production is unaffected by
  anything described in §7 onward.

## 4. Environment variables (production, on Vercel)

Auto-provisioned by Neon's Vercel integration: `DATABASE_URL`,
`DATABASE_URL_UNPOOLED`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`,
`POSTGRES_URL_NON_POOLING`, `POSTGRES_URL_NO_SSL`, `POSTGRES_HOST`,
`POSTGRES_DATABASE`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `PGHOST`,
`PGHOST_UNPOOLED`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `NEON_PROJECT_ID`,
`NEON_AUTH_BASE_URL`, `VITE_NEON_AUTH_URL`.

Added manually for the app: `SESSION_SECRET`, `STRIPE_SECRET_KEY` (test),
`STRIPE_WEBHOOK_SECRET` (test), `NEXT_PUBLIC_SITE_URL`, `MEILI_HOST`,
`MEILI_API_KEY`.

**None of these were touched by the design-refresh work.**

## 5. Critical infrastructure constraint: shared database

Preview deployments and Production **share one Neon database** —
confirmed via `vercel env ls` (every `DATABASE_URL`-family variable is
scoped to both "Preview, Production" with a single value, not separate
values per environment). The free Neon tier used here has no per-branch
database isolation available (checked: Vercel's Storage → Settings has no
"create a branch per preview deployment" toggle on this plan).

**Practical consequence**: anything that writes new rows to the database —
new seed data, new demo products — would appear on the live production
site immediately, regardless of which git branch triggered the write,
since Vercel's `vercel-build` script runs `prisma db seed` on every
branch's build automatically. This is why the design-refresh work below
uses a presentation-only image mapping instead of adding real demo
products to the database. If true preview/production data isolation is
ever needed, it requires either upgrading the Neon plan for branch support
or manually creating a second Neon branch and pointing Preview-scoped
(not Production-scoped) env vars at it.

## 6. Stripe live mode (paused, not abandoned)

The user began Stripe's live-activation flow and stopped at the point
where it asked for personal/business identity details (Emirates ID,
bank account, etc.) — a deliberate pause, not a blocker needing a fix.
Test mode is fully functional and verified end-to-end (checkout session
creation, webhook delivery, order status updates). To go live later:
finish Stripe's activation with real business details, get the
`sk_live_...` key, create a **live-mode** webhook endpoint (separate from
the test one, same URL: `https://eyeocean-platform.vercel.app/api/webhooks/stripe`,
event `checkout.session.completed`), and set `STRIPE_SECRET_KEY` /
`STRIPE_WEBHOOK_SECRET` to the live values in Vercel.

## 7. Design refresh — current state (branch: `design-refresh`)

**Latest commit: `b23d7b0`** — "Premium design pass: charcoal/sage palette,
real photography, hierarchy and a11y fixes". Branch is fully pushed to
origin (`0 ahead, 0 behind origin/design-refresh`), working tree clean,
**not merged into `main`**.

**Live preview** (SSO-protected, open while logged into Vercel):
https://eyeocean-platform-4hd3sts9p-seemab1.vercel.app

### 7.1 Why a second pass happened

The first design-refresh attempt (commit `7e864b4`) repainted the site in
a deep emerald palette. The user reviewed it and rejected it: technically
accessible (WCAG contrast passed) but not premium-feeling, and "too green"
as a dominant color rather than a restrained accent. Commit `b23d7b0` is
the response to that specific feedback — a genuine redesign pass, not a
second palette swap.

### 7.2 Color system

Defined in `src/app/globals.css`, exposed as `--eo-*` CSS variables and
Tailwind `eo-*` utility colors:

| Token | Value | Role |
|---|---|---|
| `--eo-ivory` | `#faf8f3` | Page background |
| `--eo-white` | `#ffffff` | Card/elevated surfaces |
| `--eo-obsidian` | `#1c1b19` | Primary text, buttons, dark sections — carries the design |
| `--eo-black` | `#0e0d0c` | Deepest text/background variant |
| `--eo-taupe` | `#efebe3` | Secondary background |
| `--eo-platinum` | `#e3dfd5` | Borders |
| `--eo-grey` | `#615d55` | Body text (6.17:1 on ivory) |
| `--eo-champagne` | `#72906a` | Muted sage accent — **small accents only** (eyebrow labels, underlines, active-icon states), never a large surface. Tuned so it also passes AA (4.85:1) as real text on `--eo-obsidian`, not just as decoration. |
| `--eo-champagne-text` | `#3f4a39` | Accent color safe as real text on light backgrounds (8.79:1 on ivory) |

Also added: `--eo-radius-sm` (2px) / `--eo-radius` (3px) as `rounded-eo-sm`
/ `rounded-eo` Tailwind utilities, and `--eo-shadow` as `shadow-eo` for
subtle hover elevation on cards. A global `:focus-visible` rule
(`outline: 2px solid var(--eo-obsidian)`) was added as a baseline — most
of the site previously had no explicit focus styling at all.

All contrast ratios were computed programmatically (not eyeballed) and are
documented inline in `globals.css`.

### 7.3 Structural changes

- **Header** (`src/components/Header.tsx`, `src/app/layout.tsx`):
  compacted — preview banner and utility bar padding reduced, main row
  `py-5→py-3`, icons `18px→16px`. Confirmed via live mobile testing that
  it no longer dominates the viewport.
- **Hero** (`src/components/Hero.tsx`): `min-h-88vh→72vh`, less top
  padding, so the next section is visible without scrolling on first load.
- **Product photography**: real (temporary) stock photography added via
  `src/lib/demo-images.ts`, replacing flat color-block placeholders across
  `ProductCard`, `ProductGallery`, `DepartmentBento`, `JournalCard`,
  `MegaMenu`, `CartDrawer`, `WishlistDrawer`, `SearchOverlay`, and the
  brand/journal listing pages. **This is presentation-only** — see §5 for
  why no new database rows were created. Photos are generic stock
  (picsum.photos), not category-matched; swapping in real product
  photography later needs an `imageUrl` column on `ProductImage` (a schema
  migration, intentionally not done here) plus an upload/CDN pipeline.
- **Hierarchy/typography**: product card price now bold and visually
  separated from brand/name; display/heading sizes reined in slightly;
  consistent `rounded-eo-sm` + `shadow-eo` on cards/buttons/images.

### 7.4 Accessibility fixes beyond contrast

Found via a dedicated audit, not assumed:

- `MegaMenu` had no Escape-key handler (it's driven by hover/focus state,
  not the overlay system that `OverlayRoot`'s Escape handler covers) —
  added its own listener.
- `MegaMenu`'s DOM position came after the header's icon buttons despite
  being absolutely positioned, producing a disorienting tab order — moved
  it right after the nav that triggers it (no visual change).
- `MobileNav` didn't move focus into the panel on open (unlike
  `SearchOverlay`'s existing pattern) — fixed to match.
- Gradient text-legibility scrims on photo tiles (`DepartmentBento`,
  `brands/page.tsx`) were verified against a worst-case (pure-white photo)
  contrast calculation; one was bumped from `black/60` to `black/70` after
  the math showed the lighter value failing AA for its smallest text.

### 7.5 Known remaining gaps (not fixed, intentionally — flagged for later)

- **No full focus-trap** on the four dialog-role overlays (Search,
  MobileNav, Cart, Wishlist drawers) — Tab can still cycle into hidden
  background content. A real gap, moderate priority, needs a small shared
  hook applied across 4 files — judged as more than this pass should
  absorb unreviewed.
- `MegaMenu`'s image `sizes` attribute is mildly under-specified relative
  to its actual rendered width (minor image-quality nit, not a bug).
- Placeholder photos are thematically random relative to the product they
  illustrate (expected from a generic stock service).

### 7.6 Explicitly NOT touched by this work

Stripe integration code, authentication logic, checkout/order logic,
Prisma schema, any migration, `prisma/seed.ts`, any environment variable,
`next.config.ts`'s security headers — verified via a dedicated diff audit
against `main` before this work was committed.

## 8. How to resume

1. `git checkout design-refresh` (already up to date with origin as of
   commit `b23d7b0`).
2. Review the live preview URL in §7.
3. Decide: iterate further on `design-refresh`, or merge into `main` when
   satisfied (not done automatically — requires explicit approval).
4. If resuming Stripe live-mode setup: see §6.
5. If the Meilisearch trial has lapsed: see §2's reminder date, or check
   https://cloud.meilisearch.com directly (project "EYEOCEAN", team
   "seemab's Team").
