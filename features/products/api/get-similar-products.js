import { cache } from "react";

import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { getCustomerTokenFromCookies } from "@/lib/auth/customer-token";
import {
  mapProducts,
  mapProductsMeta,
} from "@/features/products/services/product.mapper";

/**
 * Fetches similar catalog products for a supplier product.
 * GET /public/products/{supplier_product_id}/similar?company_id=&page=&per_page=
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

  const token = await getCustomerTokenFromCookies();

  try {
    const response = await fetcher(endpoints.products.similar(productId), {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      ...(token
        ? { cache: "no-store" }
        : {
            next: {
              revalidate: revalidate.medium,
              tags: [cacheTags.products],
            },
          }),
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
