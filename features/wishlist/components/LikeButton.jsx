"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useLike } from "@/features/wishlist/hooks/use-like";
import { LIKE_TYPE, resolveLikeType } from "@/features/wishlist/types";
import { cn } from "@/lib/utils";

/**
 * Unified heart control for products and companies.
 * Same animation / loading / active / inactive states everywhere.
 *
 * @param {object} props
 * @param {'company'|'company_product'|'catalog_product'} [props.type]
 * @param {'catalog'|'company'} [props.source]
 * @param {'product'|'company'} [props.kind]
 * @param {string|number} props.id
 * @param {string|number} [props.companyId]
 * @param {boolean} [props.initialLiked]
 * @param {number} [props.initialLikesCount]
 * @param {(next: { liked: boolean, likesCount: number, averageRating?: number|null }) => void} [props.onChange]
 * @param {string} [props.className]
 * @param {boolean} [props.showCount]
 * @param {'icon'|'sm'} [props.size]
 */
export default function LikeButton({
  type: typeProp,
  source,
  kind,
  id,
  companyId,
  initialLiked = false,
  initialLikesCount = 0,
  onChange,
  className,
  showCount = false,
  size = "icon",
}) {
  const type = resolveLikeType({ type: typeProp, source, kind });
  const isCompany = type === LIKE_TYPE.COMPANY;
  const t = useTranslations(isCompany ? "company" : "wishlist");

  const { liked, likesCount, toggleLike, loading, isLikesLoading } = useLike({
    type,
    id,
    companyId,
    initialLiked,
    initialLikesCount,
    onChange,
  });

  const showLoading = loading || isLikesLoading;

  return (
    <div className={cn(showCount && "flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size={size === "sm" ? "sm" : "icon-sm"}
        aria-label={liked ? t("unlike") : t("like")}
        aria-pressed={liked}
        aria-busy={showLoading}
        disabled={loading}
        className={cn(
          "relative z-[2] border-border/60 bg-card/75 shadow-sm backdrop-blur-sm hover:border-primary/30 hover:bg-card",
          liked
            ? "border-destructive/40 text-destructive hover:text-destructive"
            : "text-muted-foreground hover:text-foreground",
          size === "sm" && "gap-1.5",
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
          <Heart
            className={cn("h-4 w-4", liked && "fill-current")}
            aria-hidden
          />
        )}
        {size === "sm" ? (
          <span className="text-xs font-medium">
            {liked ? t("unlike") : t("like")}
          </span>
        ) : null}
      </Button>

      {showCount ? (
        <span className="text-sm font-semibold tabular-nums">{likesCount}</span>
      ) : null}
    </div>
  );
}
