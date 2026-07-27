import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";
import { LIKE_SOURCE } from "@/features/wishlist/types";

/**
 * Resolves the like endpoint for catalog vs company products.
 * @param {{ productId: string|number, source?: string, companyId?: string|number }} target
 */
function resolveLikePath(target) {
  const source = target.source ?? LIKE_SOURCE.CATALOG;

  if (source === LIKE_SOURCE.COMPANY) {
    if (target.companyId == null || target.companyId === "") {
      throw new Error("companyId is required for company product likes");
    }
    return endpoints.likes.company(target.companyId, target.productId);
  }

  return endpoints.likes.catalog(target.productId);
}

/**
 * Like a supplier (catalog) or company product.
 * @param {object} target
 * @param {string} token
 */
export async function likeProduct(target, token) {
  return fetchFromAPI(resolveLikePath(target), {
    method: "POST",
    token,
    cache: "no-store",
  });
}

/**
 * Unlike a supplier (catalog) or company product.
 * @param {object} target
 * @param {string} token
 */
export async function unlikeProduct(target, token) {
  return fetchFromAPI(resolveLikePath(target), {
    method: "DELETE",
    token,
    cache: "no-store",
  });
}
