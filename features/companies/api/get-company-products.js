import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { getCustomerTokenFromCookies } from "@/lib/auth/customer-token";
import {
  mapCompaniesMeta,
  mapCompanyProducts,
} from "@/features/companies/services/company.mapper";

/**
 * Fetches paginated public products for a company store.
 * GET /public/companies/{company}/products?page=&per_page=
 *
 * @param {string|number} companyId
 * @param {{
 *   page?: number|string,
 *   per_page?: number|string,
 *   category_id?: number|string|null,
 *   locale?: string,
 * }} [options]
 * @returns {Promise<{ products: object[], meta: object }>}
 */
export async function getCompanyProducts(companyId, options = {}) {
  if (companyId == null || companyId === "") {
    return {
      products: [],
      meta: { total: 0, currentPage: 1, lastPage: 1, perPage: 15 },
    };
  }

  const {
    page = 1,
    per_page = 15,
    category_id = null,
    locale = "ar",
  } = options;

  const token = await getCustomerTokenFromCookies();

  const params = {
    page,
    per_page,
  };

  if (category_id != null && category_id !== "") {
    params.category_id = category_id;
  }

  try {
    const response = await fetcher(endpoints.companies.products(companyId), {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      ...(token
        ? { cache: "no-store" }
        : {
            next: {
              revalidate: revalidate.medium,
              tags: [cacheTags.companies, cacheTags.products],
            },
          }),
    });

    const rows = response?.data ?? [];
    return {
      products: mapCompanyProducts(
        Array.isArray(rows) ? rows : [],
        companyId,
        locale,
      ),
      meta: mapCompaniesMeta(response?.meta),
    };
  } catch (error) {
    if (error?.status === 404) {
      return {
        products: [],
        meta: { total: 0, currentPage: 1, lastPage: 1, perPage: Number(per_page) || 15 },
      };
    }
    throw error;
  }
}
