# Vercel hardening notes (Watfil frontend)

Last updated after a project-wide pass on Next.js 16 + Vercel production 500s.

## Required environment variables

Set these in **Vercel → Project Settings → Environment Variables** for
**Production**, **Preview**, and **Development**, then **redeploy**.
`NEXT_PUBLIC_*` values are inlined at **build** time.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend base URL including `/api` (e.g. `https://watfil-backend.glitchfic-calw.io/api`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin for OG/robots/sitemap (e.g. `https://watfil.com`) |
| `API_DEBUG` (optional) | Set to `1` for extra API timing logs in Function Logs |

Central module: `lib/env.js` (prefer this over ad-hoc `process.env` reads).

Post-deploy check: `GET /api/health?upstream=1` → `hasApiUrl: true` and `upstream.ok: true`.

## Findings & fixes

### 1. Async `params` / `searchParams` (Next 16)

- **Status:** Already correct across `app/**/page.js` and `layout.js`.
- All dynamic routes use `await params` / `await searchParams`.

### 2. API route runtime + timeouts

- `app/api/backend/[...path]/route.js`: `runtime = "nodejs"`, `maxDuration = 30`, 12s upstream abort.
- `app/api/health/route.js`: `runtime = "nodejs"`, upstream probe with 8s abort.
- `app/sitemap.xml/route.js`: `runtime = "nodejs"`, 12s abort + error logging.
- Shared server fetch: `lib/api/fetcher.js` default timeout **12s**, clear 504/502 errors, reject non-JSON success bodies.

### 3. Centralized env

- Added `lib/env.js`.
- Wired: `lib/api/client.js`, `lib/api/fetcher.js`, `lib/seo/metadata.js`, `lib/seo/schema.js`, `app/robots.js`, blog article page, governorate default-id, checkout debug logging, API routes.
- Missing `NEXT_PUBLIC_API_URL` on the server now throws a **named** error instead of a silent relative-URL crash.

### 4. Browser-only APIs in Server Components

- **Status:** Clean. No unguarded `window` / `document` / `localStorage` in RSC paths.
- Shared helpers (`customer-token`, governorate preference, browsing session) guard with `typeof window/document`.

### 5. `error.js` coverage

Friendly UI + `console.error` via `components/common/RouteError.jsx`:

- `app/[locale]/error.js`
- `app/[locale]/(public)/error.js`
- `app/[locale]/(auth)/error.js`
- Dynamic segments: `products/[id]`, `companies/[id]`, `companies/[id]/products/[productId]`, `blog/[slug]`, `categories/[slug]`, `store/[taxNumber]`
- List segments: `products/error.js`, `companies/error.js`

### 6. `next.config.mjs` images

- `remotePatterns` now include Unsplash **and** the API hostname from `NEXT_PUBLIC_API_URL` (plus `watfil-backend.glitchfic-calw.io` fallback).
- Product/company UI mostly uses `<img>` via `MediaImage` (arbitrary hosts); config still needed for any `next/image` usage and future CDN assets.

### 7. `proxy.ts` (middleware)

- Kept thin: governorate seed redirect + next-intl only.
- Matcher already skips `api`, `_next`, `_vercel`, and paths with file extensions (`.*\\..*`).
- Comments clarified; no extra work added on the edge path.

### 8. `generateStaticParams` resilience

- All build-time params fetchers catch backend failure and return `[]` so the **build does not fail**.
- Added `console.warn` on failure for products, companies, categories, blog.

### Related detail-page hardening (prior pass)

- Logging in `getProduct` / `getCompany` / critical page fetches.
- Offerings / related content degrade gracefully where safe.
- `revalidateTag(tag, "max")` for Next 16.

## Ops checklist after deploy

1. Confirm env vars on all Vercel environments → redeploy.
2. Hit `/api/health?upstream=1`.
3. Open a random product + company URL (including newly created ids).
4. If anything 500s, read Function Logs for `[getProduct]`, `[getCompany]`, `[api]`, or `[… error boundary]`.
