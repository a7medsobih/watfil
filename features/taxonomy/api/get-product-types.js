import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { mapProductTypes } from "@/features/taxonomy/services";

/**
 * Fetches public product types.
 * GET /public/product-types
 *
 * @param {{ locale?: string }} [options]
 * @returns {Promise<object[]>}
 */
export async function getProductTypes(options = {}) {
  const { locale = "ar" } = options;

  const response = await fetchFromAPI(endpoints.productTypes.list, {
    revalidate: revalidate.long,
    tags: [cacheTags.productTypes, cacheTags.categories],
  });

  return mapProductTypes(response?.data ?? [], locale);
}
