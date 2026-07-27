import { cache } from "react";

import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, companyTag, productTag, revalidate } from "@/lib/cache";
import {
  mapCompaniesMeta,
  mapCompanyProducts,
} from "@/features/companies/services/company.mapper";

/**
 * Fetches similar products for a company product offer.
 * Cached public list — like state is handled per-card on interaction.
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

    try {
      const response = await fetchFromAPI(
        endpoints.companies.productsSimilar(companyId),
        {
          params,
          revalidate: revalidate.medium,
          tags: [
            cacheTags.companies,
            cacheTags.products,
            companyTag(companyId),
            productTag(productId),
          ],
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
