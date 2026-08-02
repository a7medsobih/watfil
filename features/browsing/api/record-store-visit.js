import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";
import { getSessionKey } from "@/features/browsing/utils/session-key";

/**
 * Records a company/store visit and returns the updated views payload.
 * Treats `duplicate_session: true` as success (caller should not surface errors).
 *
 * @param {{ companyId: number|string, token?: string|null }} params
 * @returns {Promise<{ viewsCount: number, lastVisitedAt: string|null, duplicateSession: boolean } | null>}
 */
export async function recordStoreVisit({ companyId, token = null }) {
  if (companyId == null || companyId === "") return null;

  const sessionKey = getSessionKey();
  const body = {
    company_id: Number(companyId),
  };

  // Guests must send session_key; authenticated customers may omit it.
  if (!token) {
    if (!sessionKey) return null;
    body.session_key = sessionKey;
  } else if (sessionKey) {
    body.session_key = sessionKey;
  }

  const response = await fetchFromAPI(endpoints.browsing.storeVisit, {
    method: "POST",
    token: token || undefined,
    cache: "no-store",
    body: JSON.stringify(body),
  });

  const data = response?.data ?? response ?? {};
  return {
    viewsCount: Number(data.views_count ?? data.viewsCount ?? 0),
    lastVisitedAt: data.last_visited_at ?? data.lastVisitedAt ?? null,
    duplicateSession: Boolean(
      data.duplicate_session ?? data.duplicateSession ?? false,
    ),
  };
}
