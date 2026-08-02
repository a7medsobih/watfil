import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";
import {
  RECENT_BROWSING_DEFAULT_LIMIT,
  RECENT_BROWSING_MAX_LIMIT,
} from "@/features/browsing/constants";
import { mapRecentProducts } from "@/features/browsing/services/recent-product.mapper";
import { getSessionKey } from "@/features/browsing/utils/session-key";

function clampLimit(limit) {
  const n = Number(limit) || RECENT_BROWSING_DEFAULT_LIMIT;
  return Math.min(RECENT_BROWSING_MAX_LIMIT, Math.max(1, n));
}

/**
 * Guest or customer recent products — picks endpoint from auth token.
 *
 * @param {{ token?: string|null, limit?: number, locale?: string }} [options]
 */
export async function getRecentProducts({
  token = null,
  limit = RECENT_BROWSING_DEFAULT_LIMIT,
  locale = "ar",
} = {}) {
  const clamped = clampLimit(limit);

  if (token) {
    const response = await fetchFromAPI(
      endpoints.browsing.customerRecentProducts,
      {
        token,
        cache: "no-store",
        params: { limit: clamped },
      },
    );
    return mapRecentProducts(response?.data ?? [], locale);
  }

  const sessionKey = getSessionKey();
  if (!sessionKey) return [];

  const response = await fetchFromAPI(endpoints.browsing.recentProducts, {
    cache: "no-store",
    params: { session_key: sessionKey, limit: clamped },
  });

  return mapRecentProducts(response?.data ?? [], locale);
}
