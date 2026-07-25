import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { mapProductOfferings } from "@/features/products/services/product.mapper";

/**
 * Fetches companies offering a catalog product in a governorate.
 * GET /public/products/{id}/companies?governorate_id={id}
 *
 * @param {string|number} productId
 * @param {{ governorateId?: string|number|null, locale?: string }} [options]
 */
export async function getProductCompanies(productId, options = {}) {
  if (productId == null || productId === "") return [];

  const { governorateId = null, locale = "ar" } = options;
  if (governorateId == null || governorateId === "") return [];

  try {
    const response = await fetcher(endpoints.products.companies(productId), {
      params: { governorate_id: governorateId },
      next: {
        revalidate: revalidate.medium,
        tags: [cacheTags.products, cacheTags.companies],
      },
    });

    const rows = response?.data ?? response ?? [];
    return mapProductOfferings(Array.isArray(rows) ? rows : [], locale);
  } catch (error) {
    if (error?.status === 404) return [];
    throw error;
  }
}
