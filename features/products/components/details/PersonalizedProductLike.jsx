import { getProductPersonalization } from "@/features/products/api/get-product-personalization";
import ProductLikeCluster from "@/features/products/components/details/ProductLikeCluster";
import { LIKE_SOURCE } from "@/features/wishlist/types";

/**
 * Suspense island: resolves `is_liked` without blocking the cacheable page shell.
 */
export default async function PersonalizedProductLike({
  slugOrId,
  productId,
  source = LIKE_SOURCE.CATALOG,
  companyId = null,
  likesCount = 0,
  className,
}) {
  const { isLiked } = await getProductPersonalization(slugOrId);

  return (
    <ProductLikeCluster
      productId={productId}
      source={source}
      companyId={companyId}
      initialLiked={isLiked}
      initialLikesCount={likesCount}
      className={className}
    />
  );
}

/** Lightweight pulse matching the like + count row. */
export function ProductLikeFallback({ className }) {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <div
        className={className ?? "size-10 animate-pulse rounded-md bg-muted"}
      />
      <div className="h-4 w-16 animate-pulse rounded bg-muted" />
    </div>
  );
}
