# Next Template

Feature-based Next.js template with `next-intl` (en/ar), App Router route groups, and placeholder pages ready for product work.

## Stack

- Next.js 16 (App Router)
- React 19
- next-intl (`en` / `ar`)
- Tailwind CSS 4

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
app/[locale]/(public)/   # Public pages (Navbar + Footer)
app/[locale]/(auth)/     # Auth pages (minimal layout)
features/                # Domain modules (home, products, auth, …)
components/              # Shared UI / layout / seo / skeletons
lib/                     # API client, SEO, cache, validations
i18n/ + messages/        # Locale routing and translations
```

See [`docs/folder-structure.txt`](docs/folder-structure.txt) for the full tree.

**Note:** On Next.js 16 this project uses [`proxy.ts`](proxy.ts) instead of `middleware.js` for next-intl locale routing.

## Scripts

```bash
npm run dev      # development
npm run build    # production build
npm run start    # start production server
npm run lint     # eslint
```

## Conventions

- Route files under `app/` stay thin and import from `@/features/...`
- Feature logic lives in `features/<domain>/` and is exported via `index.js`
- Shared UI stays in `components/`; shared utilities in `lib/`
