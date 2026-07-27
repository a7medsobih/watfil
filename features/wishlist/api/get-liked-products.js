import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";
import { mapLikedProducts } from "@/features/wishlist/services/liked-product.mapper";
import { mapProductsMeta } from "@/features/products/services/product.mapper";

/**
 * Builds query params for customer liked products.
 * Ready for `source=catalog|company` and pagination.
 * @param {object} [params]
 */
function buildQueryParams(params = {}) {
  const query = {};

  if (params.source) query.source = params.source;
  if (params.page != null) query.page = params.page;
  if (params.per_page != null) query.per_page = params.per_page;

  return query;
}

/**
 * Fetches the authenticated customer's liked products.
 * Always uncached (personalized).
 *
 * @param {string} token
 * @param {{ source?: 'catalog'|'company', page?: number, per_page?: number }} [params]
 * @returns {Promise<{ products: object[], meta: object }>}
 */
export async function getLikedProducts(token, params = {}) {
  const response = await fetchFromAPI(endpoints.likes.products, {
    method: "GET",
    token,
    params: buildQueryParams(params),
    cache: "no-store",
  });

  const rows = response?.data ?? response?.products ?? [];

  return {
    products: mapLikedProducts(Array.isArray(rows) ? rows : []),
    meta: mapProductsMeta(response?.meta),
  };
}
