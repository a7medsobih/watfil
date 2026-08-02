"use client";

import LikeButton from "@/features/wishlist/components/LikeButton";
import { LIKE_SOURCE, LIKE_TYPE } from "@/features/wishlist/types";

/**
 * Product heart control — thin wrapper that maps catalog/company source
 * to the unified like types.
 */
export default function ProductLikeButton({
  productId,
  source = LIKE_SOURCE.CATALOG,
  companyId,
  initialLiked = false,
  initialLikesCount = 0,
  onChange,
  className,
}) {
  const type =
    source === LIKE_SOURCE.COMPANY
      ? LIKE_TYPE.COMPANY_PRODUCT
      : LIKE_TYPE.CATALOG_PRODUCT;

  return (
    <LikeButton
      type={type}
      id={productId}
      companyId={companyId}
      initialLiked={initialLiked}
      initialLikesCount={initialLikesCount}
      onChange={onChange}
      className={className}
    />
  );
}
