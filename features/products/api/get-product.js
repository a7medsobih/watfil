import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { getCustomerTokenFromCookies } from "@/lib/auth/customer-token";
import { mapProduct } from "@/features/products/services/product.mapper";

/**
 * Fetches a single public product by id/slug.
 * Forwards customer token when present so `is_liked` is personalized.
 *
 * @param {string|number} id
 */
export async function getProduct(id) {
  if (id == null || id === "") return null;

  const token = await getCustomerTokenFromCookies();

  const response = await fetcher(endpoints.products.detail(id), {
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

  const payload = response?.data ?? response;
  return mapProduct(payload);
}
