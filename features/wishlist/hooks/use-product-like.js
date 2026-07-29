"use client";

import { useEffect, useState } from "react";

import { useLikeToggle } from "@/features/wishlist/hooks/use-like-toggle";
import { LIKE_SOURCE } from "@/features/wishlist/types";

/**
 * Product like hook — thin wrapper over the unified useLikeToggle.
 *
 * @param {object} options
 * @param {string|number} options.productId
 * @param {'catalog'|'company'} [options.source]
 * @param {string|number} [options.companyId]
 * @param {boolean} [options.initialLiked]
 * @param {number} [options.initialLikesCount]
 * @param {(next: { liked: boolean, likesCount: number }) => void} [options.onChange]
 * @param {(next: { liked: boolean, likesCount: number }) => void} [options.onSuccess]
 */
export function useProductLike({
  productId,
  source = LIKE_SOURCE.CATALOG,
  companyId,
  initialLiked = false,
  initialLikesCount = 0,
  onChange,
  onSuccess,
} = {}) {
  const [likesCount, setLikesCount] = useState(Number(initialLikesCount) || 0);

  useEffect(() => {
    setLikesCount(Number(initialLikesCount) || 0);
  }, [productId, initialLikesCount]);

  const { liked, toggleLike, loading, isLikesLoading } = useLikeToggle({
    type: "product",
    id: productId,
    source,
    companyId,
    initialLiked,
    initialLikesCount: likesCount,
    onChange: (next) => {
      setLikesCount(next.likesCount);
      onChange?.(next);
    },
    onSuccess,
  });

  return {
    liked,
    likesCount,
    toggleLike,
    loading,
    isLikesLoading,
  };
}
