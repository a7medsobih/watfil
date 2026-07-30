import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, companyTag, revalidate } from "@/lib/cache";
import {
  mapCompaniesMeta,
  mapCompanyProducts,
} from "@/features/companies/services/company.mapper";
import { PRODUCTS_PER_PAGE } from "@/features/filters/constants";

/**
 * Builds API query params for company store products.
 * Only forwards backend-supported filters (no client filtering).
 *
 * @param {object} [params]
 */
function buildQueryParams(params = {}) {
  const query = {
    page: params.page ?? 1,
    per_page: params.per_page ?? PRODUCTS_PER_PAGE,
  };

  if (params.search) query.search = params.search;
  if (params.product_type_id) query.product_type_id = params.product_type_id;
  if (params.category_id) query.category_id = params.category_id;

  if (params.min_price != null && params.min_price !== "") {
    query.min_price = params.min_price;
  }

  if (params.max_price != null && params.max_price !== "") {
    query.max_price = params.max_price;
  }

  if (params.source === "catalog" || params.source === "company") {
    query.source = params.source;
  }

  return query;
}

/**
 * Fetches paginated public products for a company store.
 * GET /public/companies/{company}/products
 *
 * Auth personalization lives in Suspense islands on detail pages.
 *
 * @param {string|number} companyId
 * @param {object} [options]
 * @returns {Promise<{ products: object[], meta: object }>}
 */
export async function getCompanyProducts(companyId, options = {}) {
  const emptyMeta = {
    total: 0,
    currentPage: 1,
    lastPage: 1,
    perPage: Number(options.per_page) || PRODUCTS_PER_PAGE,
  };

  if (companyId == null || companyId === "") {
    return { products: [], meta: emptyMeta };
  }

  const { locale = "ar", ...params } = options;
  const isSearch = Boolean(params.search);
  const query = buildQueryParams(params);

  try {
    const response = await fetchFromAPI(
      endpoints.companies.products(companyId),
      {
        params: query,
        ...(isSearch
          ? { cache: "no-store" }
          : {
              revalidate: revalidate.medium,
              tags: [
                cacheTags.companies,
                cacheTags.products,
                companyTag(companyId),
              ],
            }),
      },
    );

    const rows = response?.data ?? [];
    // Prefer products_meta when backend sends it; fall back to meta.
    const rawMeta = response?.products_meta ?? response?.meta;

    return {
      products: mapCompanyProducts(
        Array.isArray(rows) ? rows : [],
        companyId,
        locale,
      ),
      meta: mapCompaniesMeta(rawMeta),
    };
  } catch (error) {
    if (error?.status === 404) {
      return { products: [], meta: emptyMeta };
    }
    throw error;
  }
}
