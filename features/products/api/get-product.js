import { cache } from "react";

import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, productTag, revalidate } from "@/lib/cache";
import { mapProduct } from "@/features/products/services/product.mapper";
import { toProductRouteId } from "@/features/products/utils/product-slug";

/**
 * Fetches a single public product by id.
 * Always cached — does not read cookies so the page shell stays ISR-friendly.
 * Use `getProductPersonalization` inside Suspense for `is_liked`.
 *
 * @param {string|number} id
 * @param {string} [locale]
 */
export const getProduct = cache(async function getProduct(id, locale = "ar") {
  const productId = toProductRouteId(id);
  if (!productId) return null;

  try {
    const response = await fetchFromAPI(endpoints.products.detail(productId), {
      revalidate: revalidate.medium,
      tags: [cacheTags.products, productTag(productId)],
    });

    const payload = response?.data ?? response;
    return mapProduct(payload, locale);
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
});
