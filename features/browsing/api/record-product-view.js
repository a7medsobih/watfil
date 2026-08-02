import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";
import { normalizeProductSource } from "@/features/browsing/types";
import { getSessionKey } from "@/features/browsing/utils/session-key";

function pickViewsPayload(response) {
  const root = response?.data ?? response ?? {};
  // Support both `{ data: { views_count } }` and flattened bodies.
  const nested =
    root && typeof root === "object" && root.data && typeof root.data === "object"
      ? root.data
      : null;
  const payload = nested ?? root;

  return {
    viewsCount: Number(payload.views_count ?? payload.viewsCount ?? NaN),
    lastViewedAt: payload.last_viewed_at ?? payload.lastViewedAt ?? null,
    duplicateSession: Boolean(
      payload.duplicate_session ?? payload.duplicateSession ?? false,
    ),
  };
}

/**
 * Records a product view (company store or catalog-in-company context).
 *
 * @param {{
 *   companyId: number|string,
 *   productId: number|string,
 *   productSource?: string,
 *   token?: string|null,
 * }} params
 * @returns {Promise<{ viewsCount: number, lastViewedAt: string|null, duplicateSession: boolean } | null>}
 */
export async function recordProductView({
  companyId,
  productId,
  productSource = "catalog",
  token = null,
}) {
  if (companyId == null || companyId === "") return null;
  if (productId == null || productId === "") return null;

  const sessionKey = getSessionKey();
  const body = {
    company_id: Number(companyId),
    product_id: Number(productId),
    product_source: normalizeProductSource(productSource),
  };

  if (!token) {
    if (!sessionKey) return null;
    body.session_key = sessionKey;
  } else if (sessionKey) {
    body.session_key = sessionKey;
  }

  const response = await fetchFromAPI(endpoints.browsing.productView, {
    method: "POST",
    token: token || undefined,
    cache: "no-store",
    body: JSON.stringify(body),
  });

  const parsed = pickViewsPayload(response);
  return {
    viewsCount: Number.isFinite(parsed.viewsCount) ? parsed.viewsCount : 0,
    lastViewedAt: parsed.lastViewedAt,
    duplicateSession: parsed.duplicateSession,
  };
}
