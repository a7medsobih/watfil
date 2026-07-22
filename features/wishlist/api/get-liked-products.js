import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/request";
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
 *
 * @param {string} token
 * @param {{ source?: 'catalog'|'company', page?: number, per_page?: number }} [params]
 * @returns {Promise<{ products: object[], meta: object }>}
 */
export async function getLikedProducts(token, params = {}) {
  const response = await apiRequest(endpoints.likes.products, {
    method: "GET",
    token,
    params: buildQueryParams(params),
  });

  const rows = response?.data ?? response?.products ?? [];

  return {
    products: mapLikedProducts(Array.isArray(rows) ? rows : []),
    meta: mapProductsMeta(response?.meta),
  };
}
