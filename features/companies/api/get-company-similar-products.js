import { cache } from "react";

import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { getCustomerTokenFromCookies } from "@/lib/auth/customer-token";
import {
  mapCompaniesMeta,
  mapCompanyProducts,
} from "@/features/companies/services/company.mapper";

/**
 * Fetches similar products for a company product offer.
 * GET /public/companies/{company_id}/products/similar
 *
 * @param {string|number} companyId
 * @param {{
 *   productId: string|number,
 *   source?: "catalog"|"company",
 *   governorateId?: string|number|null,
 *   locale?: string,
 * }} options
 * @returns {Promise<{ products: object[], meta: object }>}
 */
export const getCompanySimilarProducts = cache(
  async function getCompanySimilarProducts(companyId, options = {}) {
    const empty = {
      products: [],
      meta: { total: 0, currentPage: 1, lastPage: 1, perPage: 15 },
    };

    if (companyId == null || companyId === "") return empty;

    const {
      productId,
      source = "company",
      governorateId = null,
      locale = "ar",
    } = options;

    if (productId == null || productId === "") return empty;

    const resolvedSource = source === "catalog" ? "catalog" : "company";

    const params = {
      source: resolvedSource,
      product_id: productId,
    };

    if (governorateId != null && governorateId !== "") {
      params.governorate_id = governorateId;
    }

    const token = await getCustomerTokenFromCookies();

    try {
      const response = await fetcher(
        endpoints.companies.productsSimilar(companyId),
        {
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
        },
      );

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
      if (error?.status === 404 || error?.status === 422) return empty;
      throw error;
    }
  },
);
