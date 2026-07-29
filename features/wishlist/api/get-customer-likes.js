import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";
import { mapLikedProducts } from "@/features/wishlist/services/liked-product.mapper";
import { mapLikedCompanies } from "@/features/wishlist/services/liked-company.mapper";
import { mapProductsMeta } from "@/features/products/services/product.mapper";
import { mapCompaniesMeta } from "@/features/companies/services/company.mapper";

/**
 * Builds query params for the unified likes endpoint.
 * @param {object} [params]
 */
function buildQueryParams(params = {}) {
  const query = {};

  if (params.source) query.source = params.source;
  if (params.products_page != null) query.products_page = params.products_page;
  if (params.products_per_page != null) {
    query.products_per_page = params.products_per_page;
  }
  if (params.companies_page != null) {
    query.companies_page = params.companies_page;
  }
  if (params.companies_per_page != null) {
    query.companies_per_page = params.companies_per_page;
  }

  return query;
}

function emptyMeta() {
  return { total: 0, currentPage: 1, lastPage: 1, perPage: 15 };
}

/**
 * Fetches unified customer likes (products + companies).
 * Always uncached (personalized).
 *
 * @param {string} token
 * @param {{
 *   source?: 'catalog'|'company',
 *   products_page?: number,
 *   products_per_page?: number,
 *   companies_page?: number,
 *   companies_per_page?: number,
 * }} [params]
 * @param {string} [locale]
 * @returns {Promise<{
 *   products: object[],
 *   companies: object[],
 *   meta: { products: object, companies: object },
 * }>}
 */
export async function getCustomerLikes(token, params = {}, locale = "ar") {
  const response = await fetchFromAPI(endpoints.likes.all, {
    method: "GET",
    token,
    params: buildQueryParams(params),
    cache: "no-store",
  });

  const data = response?.data ?? response ?? {};
  const productRows = data.products ?? [];
  const companyRows = data.companies ?? [];
  const meta = response?.meta ?? {};

  return {
    products: mapLikedProducts(Array.isArray(productRows) ? productRows : []),
    companies: mapLikedCompanies(
      Array.isArray(companyRows) ? companyRows : [],
      locale,
    ),
    meta: {
      products: mapProductsMeta(meta.products),
      companies: mapCompaniesMeta(meta.companies),
    },
  };
}

/**
 * Fetches liked companies only (when products are not needed).
 * @param {string} token
 * @param {{ page?: number, per_page?: number }} [params]
 * @param {string} [locale]
 */
export async function getLikedCompanies(token, params = {}, locale = "ar") {
  const query = {};
  if (params.page != null) query.page = params.page;
  if (params.per_page != null) query.per_page = params.per_page;

  const response = await fetchFromAPI(endpoints.likes.companies, {
    method: "GET",
    token,
    params: query,
    cache: "no-store",
  });

  const rows = response?.data ?? response?.companies ?? [];

  return {
    companies: mapLikedCompanies(Array.isArray(rows) ? rows : [], locale),
    meta: mapCompaniesMeta(response?.meta) ?? emptyMeta(),
  };
}

/**
 * Hydrate helper: walk all pages of the unified likes endpoint and collect IDs.
 * Uses a large per_page to minimize round-trips.
 *
 * @param {string} token
 * @returns {Promise<{ productIds: string[], companyIds: string[] }>}
 */
export async function fetchAllLikedIds(token) {
  const perPage = 100;
  const productIds = new Set();
  const companyIds = new Set();

  let productsPage = 1;
  let companiesPage = 1;
  let productsDone = false;
  let companiesDone = false;

  while (!productsDone || !companiesDone) {
    const result = await getCustomerLikes(token, {
      products_page: productsDone ? 1 : productsPage,
      products_per_page: productsDone ? 1 : perPage,
      companies_page: companiesDone ? 1 : companiesPage,
      companies_per_page: companiesDone ? 1 : perPage,
    });

    if (!productsDone) {
      for (const product of result.products) {
        if (product?.id != null) productIds.add(String(product.id));
      }
      const last = Number(result.meta.products.lastPage) || 1;
      if (productsPage >= last) productsDone = true;
      else productsPage += 1;
    }

    if (!companiesDone) {
      for (const company of result.companies) {
        if (company?.id != null) companyIds.add(String(company.id));
      }
      const last = Number(result.meta.companies.lastPage) || 1;
      if (companiesPage >= last) companiesDone = true;
      else companiesPage += 1;
    }
  }

  return {
    productIds: [...productIds],
    companyIds: [...companyIds],
  };
}
