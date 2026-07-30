import { mapProduct } from "@/features/products/services/product.mapper";
import { LIKE_SOURCE } from "@/features/wishlist/types";

/**
 * Normalizes a liked-product row from GET /customer/likes/products.
 * Supports catalog + company payloads and preserves like source.
 */
export function mapLikedProduct(item) {
  if (!item) return null;

  const nested = item.product ?? item;
  const product = mapProduct(nested);
  if (!product) return null;

  const source =
    item.source ??
    nested.source ??
    (item.company_id || nested.company_id
      ? LIKE_SOURCE.COMPANY
      : LIKE_SOURCE.CATALOG);

  const companyId =
    item.company_id ??
    nested.company_id ??
    item.company?.id ??
    nested.company?.id ??
    null;

  // Company id drives ProductCard links for company-liked products.
  const routeCompanyId = companyId != null ? companyId : null;

  return {
    ...product,
    isLiked: true,
    likesCount: Number(
      nested.likes_count ?? item.likes_count ?? product.likesCount ?? 0,
    ),
    likeSource: source === LIKE_SOURCE.COMPANY ? LIKE_SOURCE.COMPANY : LIKE_SOURCE.CATALOG,
    companyId: routeCompanyId,
  };
}

export function mapLikedProducts(items = []) {
  return items.map(mapLikedProduct).filter(Boolean);
}
