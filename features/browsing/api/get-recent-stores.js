import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";
import {
  RECENT_BROWSING_DEFAULT_LIMIT,
  RECENT_BROWSING_MAX_LIMIT,
} from "@/features/browsing/constants";
import { mapRecentStores } from "@/features/browsing/services/recent-store.mapper";
import { getSessionKey } from "@/features/browsing/utils/session-key";

function clampLimit(limit) {
  const n = Number(limit) || RECENT_BROWSING_DEFAULT_LIMIT;
  return Math.min(RECENT_BROWSING_MAX_LIMIT, Math.max(1, n));
}

/**
 * Guest or customer recent stores — picks endpoint from auth token.
 *
 * @param {{ token?: string|null, limit?: number, locale?: string }} [options]
 */
export async function getRecentStores({
  token = null,
  limit = RECENT_BROWSING_DEFAULT_LIMIT,
  locale = "ar",
} = {}) {
  const clamped = clampLimit(limit);

  if (token) {
    const response = await fetchFromAPI(
      endpoints.browsing.customerRecentStores,
      {
        token,
        cache: "no-store",
        params: { limit: clamped },
      },
    );
    return mapRecentStores(response?.data ?? [], locale);
  }

  const sessionKey = getSessionKey();
  if (!sessionKey) return [];

  const response = await fetchFromAPI(endpoints.browsing.recentStores, {
    cache: "no-store",
    params: { session_key: sessionKey, limit: clamped },
  });

  return mapRecentStores(response?.data ?? [], locale);
}
