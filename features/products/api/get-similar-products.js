import { cache } from "react";

import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, productTag, revalidate } from "@/lib/cache";
import {
  mapProducts,
  mapProductsMeta,
} from "@/features/products/services/product.mapper";

/**
 * Fetches similar catalog products for a supplier product.
 * Cached public list — like state is handled per-card on interaction.
 *
 * @param {string|number} productId Supplier / catalog product id
 * @param {{
 *   companyId?: string|number|null,
 *   page?: number|string,
 *   perPage?: number|string,
 *   locale?: string,
 * }} [options]
 * @returns {Promise<{ products: object[], meta: object }>}
 */
export const getSimilarProducts = cache(async function getSimilarProducts(
  productId,
  options = {},
) {
  const empty = {
    products: [],
    meta: { total: 0, currentPage: 1, lastPage: 1, perPage: 15 },
  };

  if (productId == null || productId === "") return empty;

  const {
    companyId = null,
    page = 1,
    perPage = 15,
    locale = "ar",
  } = options;

  const params = {
    page,
    per_page: perPage,
  };

  if (companyId != null && companyId !== "") {
    params.company_id = companyId;
  }

  try {
    const response = await fetchFromAPI(endpoints.products.similar(productId), {
      params,
      revalidate: revalidate.medium,
      tags: [cacheTags.products, productTag(productId)],
    });

    const rows = response?.data ?? [];
    return {
      products: mapProducts(Array.isArray(rows) ? rows : [], locale),
      meta: mapProductsMeta(response?.meta),
    };
  } catch (error) {
    if (error?.status === 404 || error?.status === 422) return empty;
    throw error;
  }
});
