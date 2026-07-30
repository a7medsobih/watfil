import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { getCustomerTokenFromCookies } from "@/lib/auth/customer-token";
import { toProductRouteId } from "@/features/products/utils/product-slug";

/**
 * Personalized product fields (`is_liked`) for Suspense islands.
 * Always `no-store` — safe to call only inside a Suspense boundary.
 *
 * @param {string|number} id
 * @returns {Promise<{ isLiked: boolean }>}
 */
export async function getProductPersonalization(id) {
  const empty = { isLiked: false };
  const productId = toProductRouteId(id);
  if (!productId) return empty;

  const token = await getCustomerTokenFromCookies();
  if (!token) return empty;

  try {
    const response = await fetchFromAPI(endpoints.products.detail(productId), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const payload = response?.data ?? response;
    return {
      isLiked: Boolean(payload?.is_liked ?? payload?.is_wishlisted),
    };
  } catch {
    return empty;
  }
}
