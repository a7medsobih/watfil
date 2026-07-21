import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { mapProduct } from "@/features/products/services/product.mapper";

/**
 * Fetches a single public product by id/slug.
 * Prepared for Product Details — not required by current pages.
 *
 * @param {string|number} id
 */
export async function getProduct(id) {
  if (id == null || id === "") return null;

  const response = await fetcher(endpoints.products.detail(id), {
    next: {
      revalidate: revalidate.medium,
      tags: [cacheTags.products],
    },
  });

  const payload = response?.data ?? response;
  return mapProduct(payload);
}
