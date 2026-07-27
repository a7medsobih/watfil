import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
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
 * Search queries are never cached. Auth personalization lives in Suspense islands.
 *
 * @param {object} [params]
 * @returns {Promise<{ products: object[], meta: object }>}
 */
export async function getProducts(params = {}) {
  const isSearch = Boolean(params.search);

  const response = await fetchFromAPI(endpoints.products.list, {
    params: buildQueryParams(params),
    ...(isSearch
      ? { cache: "no-store" }
      : {
          revalidate: revalidate.medium,
          tags: [cacheTags.products],
        }),
  });

  return {
    products: mapProducts(response?.data ?? []),
    meta: mapProductsMeta(response?.meta),
  };
}
