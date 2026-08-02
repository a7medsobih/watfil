import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { maybeGovernorateRedirect } from "./features/governorate/ensure";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

/**
 * Locale resolution order (next-intl + routing config):
 * 1) Locale prefix in the path (`/en/...`) → that locale
 * 2) No prefix → `defaultLocale` (`ar`) — `/` is Arabic without a prefix
 *
 * `localeDetection: false` skips Accept-Language and cookie auto-redirects so
 * English-browser visitors still land on Arabic unless they opt into `/en`.
 *
 * Keep this file thin: only i18n + rare governorate URL seeding.
 * Heavy work (API lists, auth) must stay in Server Components / Route Handlers.
 */
export default async function proxy(request: NextRequest) {
  const governorateRedirect = await maybeGovernorateRedirect(request);
  if (governorateRedirect) return governorateRedirect;

  return handleI18n(request);
}

/**
 * Skip API, Next internals, Vercel internals, and any path with a file extension
 * (static assets under /public, favicons, images, etc.).
 */
export const config = {
  matcher: [
    "/(ar|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
