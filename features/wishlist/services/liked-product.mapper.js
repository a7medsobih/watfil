import { mapProduct } from "@/features/products/services/product.mapper";
import { LIKE_SOURCE } from "@/features/wishlist/types";

/**
 * Normalizes a liked-product row from GET /customer/likes.
 * Shape: `{ liked_at, source: 'catalog'|'company', product: { … } }`
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
    product.companyId ??
    null;

  return {
    ...product,
    isLiked: true,
    likesCount: Number(
      nested.likes_count ?? item.likes_count ?? product.likesCount ?? 0,
    ),
    likeSource:
      source === LIKE_SOURCE.COMPANY
        ? LIKE_SOURCE.COMPANY
        : LIKE_SOURCE.CATALOG,
    companyId: companyId != null ? companyId : null,
    likedAt: item.liked_at ?? null,
  };
}

export function mapLikedProducts(items = []) {
  return items.map(mapLikedProduct).filter(Boolean);
}
