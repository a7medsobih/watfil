import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import {
  mapProducts,
  mapProductsMeta,
} from "@/features/products/services/product.mapper";
import {
  mapCompanies,
  mapCompaniesMeta,
} from "@/features/companies/services/company.mapper";

/**
 * Unified catalog search (always uncached).
 * Supports AbortController via `signal` for request deduplication.
 *
 * @param {object} options
 * @param {string} options.q
 * @param {"all"|"products"|"companies"} [options.type]
 * @param {number} [options.page]
 * @param {number} [options.perPage]
 * @param {string} [options.locale]
 * @param {AbortSignal} [options.signal]
 */
export async function searchCatalog({
  q,
  type = "all",
  page = 1,
  perPage = 15,
  locale = "ar",
  signal,
} = {}) {
  const query = String(q || "").trim();
  const emptyProducts = {
    products: [],
    meta: { total: 0, currentPage: 1, lastPage: 1, perPage },
  };
  const emptyCompanies = {
    companies: [],
    meta: { total: 0, currentPage: 1, lastPage: 1, perPage },
  };

  if (!query) {
    return { products: emptyProducts, companies: emptyCompanies, query };
  }

  const wantProducts = type === "all" || type === "products";
  const wantCompanies = type === "all" || type === "companies";

  const [productsResult, companiesResult] = await Promise.all([
    wantProducts
      ? fetchFromAPI(endpoints.products.list, {
          params: { search: query, page, per_page: perPage },
          cache: "no-store",
          signal,
        }).then((response) => ({
          products: mapProducts(response?.data ?? [], locale),
          meta: mapProductsMeta(response?.meta),
        }))
      : Promise.resolve(emptyProducts),
    wantCompanies
      ? fetchFromAPI(endpoints.companies.list, {
          params: { search: query, page, per_page: perPage },
          cache: "no-store",
          signal,
        })
          .then((response) => ({
            companies: mapCompanies(response?.data ?? [], locale),
            meta: mapCompaniesMeta(response?.meta),
          }))
          .catch(() => emptyCompanies)
      : Promise.resolve(emptyCompanies),
  ]);

  return {
    products: productsResult,
    companies: companiesResult,
    query,
  };
}
