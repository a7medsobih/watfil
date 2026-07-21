import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import {
  mapProducts,
  mapProductsMeta,
} from "@/features/products/services/product.mapper";

/**
 * Builds API query params from Search Params / callers.
 * Ready for future: search, category, sort — without rewriting this module.
 * @param {object} [params]
 */
function buildQueryParams(params = {}) {
  const query = {
    page: params.page ?? 1,
    per_page: params.per_page ?? 15,
  };

  if (params.search != null && params.search !== "") {
    query.search = params.search;
  }

  if (params.category != null && params.category !== "") {
    query.category = params.category;
  }

  if (params.sort != null && params.sort !== "") {
    query.sort = params.sort;
  }

  return query;
}

/**
 * Fetches paginated public products from the backend.
 * Relies entirely on backend pagination (no client-side paging).
 *
 * @param {object} [params]
 * @returns {Promise<{ products: object[], meta: object }>}
 */
export async function getProducts(params = {}) {
  const response = await fetcher(endpoints.products.list, {
    params: buildQueryParams(params),
    next: {
      revalidate: revalidate.medium,
      tags: [cacheTags.products],
    },
  });

  return {
    products: mapProducts(response?.data ?? []),
    meta: mapProductsMeta(response?.meta),
  };
}
