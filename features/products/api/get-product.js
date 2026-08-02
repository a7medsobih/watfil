import { cache } from "react";

import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, productTag, revalidate } from "@/lib/cache";
import { mapProduct } from "@/features/products/services/product.mapper";

/**
 * Fetches a single public product by id.
 * Always cached — does not read cookies so the page shell stays ISR-friendly.
 * Use `getProductPersonalization` inside Suspense for `is_liked`.
 *
 * @param {string|number} id
 * @param {string} [locale]
 */
export const getProduct = cache(async function getProduct(id, locale = "ar") {
  if (id == null || id === "") return null;
  const productId = String(id);

  try {
    const response = await fetchFromAPI(endpoints.products.detail(productId), {
      revalidate: revalidate.medium,
      tags: [cacheTags.products, productTag(productId)],
    });

    const payload = response?.data ?? response;
    if (!payload || typeof payload !== "object") {
      console.error(`[getProduct] unexpected payload for id=${productId}`, {
        type: typeof payload,
      });
      return null;
    }

    const mapped = mapProduct(payload, locale);
    if (!mapped?.id) {
      console.error(`[getProduct] mapper returned empty model for id=${productId}`);
      return null;
    }

    console.info(`[getProduct] ok id=${productId}`);
    return mapped;
  } catch (error) {
    if (error?.status === 404) {
      console.info(`[getProduct] not found id=${productId}`);
      return null;
    }

    console.error(`[getProduct] failed id=${productId}`, {
      status: error?.status,
      code: error?.code,
      message: error?.message,
    });
    throw error;
  }
});
