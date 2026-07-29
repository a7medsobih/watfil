"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useProductLike } from "@/features/wishlist/hooks";
import { LIKE_SOURCE } from "@/features/wishlist/types";
import { cn } from "@/lib/utils";

/**
 * Icon-only like control (matches compare button layout).
 * Optimistic UI lives in the unified likes store.
 *
 * @param {object} props
 * @param {string|number} props.productId
 * @param {'catalog'|'company'} [props.source]
 * @param {string|number} [props.companyId]
 * @param {boolean} [props.initialLiked]
 * @param {number} [props.initialLikesCount]
 * @param {(next: { liked: boolean, likesCount: number }) => void} [props.onChange]
 * @param {string} [props.className]
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
  const t = useTranslations("wishlist");
  const { liked, toggleLike, loading, isLikesLoading } = useProductLike({
    productId,
    source,
    companyId,
    initialLiked,
    initialLikesCount,
    onChange,
  });

  const showLoading = loading || isLikesLoading;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={liked ? t("unlike") : t("like")}
      aria-pressed={liked}
      aria-busy={showLoading}
      disabled={loading}
      className={cn(
        "relative z-[2] border-border/60 bg-card/75 shadow-sm backdrop-blur-sm hover:border-primary/30 hover:bg-card",
        liked
          ? "border-destructive/40 text-destructive hover:text-destructive"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isLikesLoading) return;
        toggleLike();
      }}
    >
      {showLoading ? (
        <Heart className="h-4 w-4 animate-pulse opacity-50" aria-hidden />
      ) : (
        <Heart className={cn("h-4 w-4", liked && "fill-current")} aria-hidden />
      )}
    </Button>
  );
}
