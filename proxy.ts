import createMiddleware from "next-intl/middleware";

import { maybeGovernorateRedirect } from "./features/governorate/ensure";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

/**
 * Network boundary (Next.js 16 proxy):
 * 1) Seed governorate query params before any page/loading UI.
 * 2) next-intl locale routing.
 */
export default async function proxy(request) {
  const governorateRedirect = await maybeGovernorateRedirect(request);
  if (governorateRedirect) return governorateRedirect;

  return handleI18n(request);
}

export const config = {
  matcher: ["/(ar|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
