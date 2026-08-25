# Watfil

Customer-facing web platform for discovering water filtration products and companies across the Watfil marketplace ecosystem.

## Overview

Watfil is a digital marketplace for water filters and treatment solutions. It connects customers with certified companies through one platform — so buyers can explore products, compare options, and place orders, while companies reach customers through a shared catalog and public store presence.

This repository is the **Watfil website frontend**: a Next.js application that delivers the customer experience and public company surfaces, integrated with a Laravel backend API.

## Live Demo

[**Visit Watfil Website →**](https://watfil-website.vercel.app/)

## How It Works

**Customer → Watfil Platform → Companies**

- **Customer** — Discovers companies and products, filters and compares offers, saves favorites, builds a cart, and submits orders.
- **Watfil Platform** — Hosts the shared catalog, company storefronts, and customer flows that connect demand with suppliers.
- **Company** — Publishes products on the platform and serves customers through its public store; onboarding starts via a join request on the website.
- **Super Admin** — Operates the platform ecosystem (companies, catalog, and central content) that this frontend consumes via API.

## Key Features

- Product catalog with search and filtering
- Company directory and public company store pages
- Product comparison
- Wishlist / likes (products and companies)
- Single-company shopping cart and checkout
- Customer authentication (login & registration)
- Company join requests
- Blog and content pages
- Recently viewed products and stores
- Governorate-based browsing
- Company ratings
- Public store share links with mobile app handoff
- Arabic / English localization with RTL support
- Responsive web experience

## User Roles

| Role        | Purpose on the platform                                              |
| ----------- | -------------------------------------------------------------------- |
| Customer    | Discover, compare, wishlist, cart, and place orders                  |
| Company     | Appear via public store; request to join the Watfil network          |
| Super Admin | Manage the platform ecosystem that powers catalog and company data   |

> This frontend implements the **customer** experience and public company surfaces. Company and Super Admin operational dashboards are outside this repository.

## Frontend Architecture

Feature-based Next.js App Router architecture:

- `app/[locale]/` — Thin route layers with locale-aware public, auth, and store-share groups
- `features/` — Domain modules (products, companies, cart, checkout, auth, wishlist, compare, …)
- `components/` — Shared UI, layout, and design-system primitives
- `lib/` — API client, auth helpers, SEO, and shared utilities
- `stores/` — Zustand client state (auth, cart, compare, likes, UI)
- `i18n/` + `messages/` — Locale routing and translations (`ar` default, `en`)

## API Integration

The frontend integrates with **Laravel** backend APIs (Sanctum). Browser requests go through a Next.js `/api/backend` proxy; server components call the API directly.

Main domains in use:

- Authentication (`/customer/auth`, login, register)
- Products & catalog
- Companies & public store
- Categories & product types
- Likes / wishlist
- Product comparison
- Orders (create via checkout)
- Browsing history
- Blog
- Company join requests
- Site statistics & governorates

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **Zustand**
- **next-intl**
- **shadcn/ui** + **Radix UI**
- **Lucide React**
- **Motion**
- **Swiper** / Embla Carousel
- **Sonner**
- **next-themes**

## My Contribution

As a **Frontend React Developer** on Watfil:

- Built the customer-facing Next.js experience for the Watfil marketplace
- Developed reusable, feature-based React components and pages
- Implemented catalog, company stores, wishlist, comparison, cart, and checkout flows
- Integrated the frontend with Laravel APIs (auth, products, companies, likes, orders, browsing)
- Delivered bilingual Arabic/English UI with proper RTL layout
- Built responsive layouts and public store-share pages ready for Flutter / WebView handoff
- Collaborated with backend and mobile teams around shared API contracts and store deep links

## Project Highlights

- Multi-role marketplace model with a focused customer web frontend
- API-driven architecture against a Laravel backend
- Modular feature-based codebase for scalable product work
- Localization-first UX (`ar` / `en`) with native RTL support
- Unified likes, comparison, and single-company cart aligned with order APIs
- Store share surfaces designed for web ↔ mobile app continuity

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `NEXT_PUBLIC_API_URL` (Laravel API base including `/api`).

Open [http://localhost:3000](http://localhost:3000).
