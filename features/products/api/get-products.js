import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { getCustomerTokenFromCookies } from "@/lib/auth/customer-token";
import {
  mapProducts,
  mapProductsMeta,
} from "@/features/products/services/product.mapper";

/**
 * Builds API query params from Search Params / callers.
 * @param {object} [params]
 */
function buildQueryParams(params = {}) {
  const query = {
    page: params.page ?? 1,
    per_page: params.per_page ?? 15,
  };

  if (params.search) query.search = params.search;
  if (params.category_id) query.category_id = params.category_id;
  if (params.governorate_id) query.governorate_id = params.governorate_id;

  if (params.min_price != null && params.min_price !== "") {
    query.min_price = params.min_price;
  }

  if (params.max_price != null && params.max_price !== "") {
    query.max_price = params.max_price;
  }

  if (params.sort) query.sort = params.sort;

  return query;
}

/**
 * Fetches paginated public products from the backend.
 * Forwards customer token when present so `is_liked` is personalized.
 *
 * @param {object} [params]
 * @returns {Promise<{ products: object[], meta: object }>}
 */
export async function getProducts(params = {}) {
  const token = await getCustomerTokenFromCookies();

  const response = await fetcher(endpoints.products.list, {
    params: buildQueryParams(params),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    ...(token
      ? { cache: "no-store" }
      : {
          next: {
            revalidate: revalidate.medium,
            tags: [cacheTags.products],
          },
        }),
  });

  // #region agent log
  {
    const rows = response?.data ?? [];
    const sample = Array.isArray(rows) ? rows.slice(0, 3) : [];
    fetch("http://127.0.0.1:7529/ingest/2917933e-5348-491e-879c-a647a465a9c2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "e4f2de",
      },
      body: JSON.stringify({
        sessionId: "e4f2de",
        runId: "post-fix",
        hypothesisId: "A,B",
        location: "features/products/api/get-products.js:getProducts",
        message: "Server products fetch with cookie token",
        data: {
          hasAuthOption: Boolean(token),
          sampleCount: sample.length,
          sampleLikes: sample.map((p) => ({
            id: p?.id,
            is_liked: p?.is_liked,
            is_wishlisted: p?.is_wishlisted,
            likes_count: p?.likes_count,
            keys: p ? Object.keys(p).filter((k) => /like|wish/i.test(k)) : [],
          })),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
  // #endregion

  return {
    products: mapProducts(response?.data ?? []),
    meta: mapProductsMeta(response?.meta),
  };
}
