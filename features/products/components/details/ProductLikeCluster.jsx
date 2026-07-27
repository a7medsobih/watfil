"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import ProductLikeButton from "@/features/wishlist/components/ProductLikeButton";
import { LIKE_SOURCE } from "@/features/wishlist/types";

/**
 * Client cluster: like button + live likes count.
 * Used as a slot from the server Suspense island.
 */
export default function ProductLikeCluster({
  productId,
  source = LIKE_SOURCE.CATALOG,
  companyId = null,
  initialLiked = false,
  initialLikesCount = 0,
  className,
}) {
  const t = useTranslations("product");
  const [likesCount, setLikesCount] = useState(Number(initialLikesCount) || 0);

  return (
    <div className="flex items-center gap-2">
      <ProductLikeButton
        productId={productId}
        source={source}
        companyId={companyId}
        initialLiked={initialLiked}
        initialLikesCount={likesCount}
        onChange={(next) => setLikesCount(next.likesCount)}
        className={className}
      />
      <span className="text-sm text-muted-foreground">
        <span className="font-semibold tabular-nums text-foreground">
          {likesCount}
        </span>{" "}
        {t("likes")}
      </span>
    </div>
  );
}
