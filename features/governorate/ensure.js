import { NextResponse } from "next/server";

import { getDefaultGovernorateId } from "./default-id";
import {
  applyGovernoratePreferenceCookie,
  isGovernorateAll,
  isGovernorateId,
  readGovernoratePreferenceFromStore,
} from "./preference";
import { matchGovernorateSeedRoute } from "./routes";

/**
 * Resolve which governorate id to seed into the URL.
 *
 * @param {object} options
 * @param {string | null} options.preferred
 * @param {boolean} options.allowsAll
 * @param {string | null} options.locale
 * @returns {Promise<string | number | null>}
 */
async function resolveSeedId({ preferred, allowsAll, locale }) {
  if (allowsAll && isGovernorateAll(preferred)) {
    return null;
  }

  if (isGovernorateId(preferred)) {
    return preferred;
  }

  return getDefaultGovernorateId(locale ?? "ar");
}

/**
 * Before any page / loading.js runs: if a governorate-dependent route is
 * missing its query param, 307 to the same path with the preferred (or default)
 * governorate. Sets the preference cookie when seeding from the API default.
 *
 * @param {import("next/server").NextRequest} request
 * @returns {Promise<import("next/server").NextResponse | null>}
 */
export async function maybeGovernorateRedirect(request) {
  const route = matchGovernorateSeedRoute(request.nextUrl.pathname);
  if (!route) return null;

  const rawParam = request.nextUrl.searchParams.get(route.paramKey);
  if (rawParam != null && rawParam !== "") {
    // Param already present — page validates known ids.
    return null;
  }

  const preferred = readGovernoratePreferenceFromStore(request.cookies);

  // Products: user explicitly chose "all" → leave URL without governorate.
  if (route.allowsAll && isGovernorateAll(preferred)) {
    return null;
  }

  const seedId = await resolveSeedId({
    preferred,
    allowsAll: route.allowsAll,
    locale: route.locale,
  });

  if (seedId == null) return null;

  const url = request.nextUrl.clone();
  url.searchParams.set(route.paramKey, String(seedId));

  const response = NextResponse.redirect(url);
  const secure = request.nextUrl.protocol === "https:";

  // Persist default so later navigations to bare /companies|/products are instant.
  if (!isGovernorateId(preferred)) {
    applyGovernoratePreferenceCookie(response, seedId, { secure });
  }

  return response;
}
