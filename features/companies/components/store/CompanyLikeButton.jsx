"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLikeToggle } from "@/features/wishlist/hooks";
import { cn } from "@/lib/utils";

/**
 * Company like control — mirrors product like UX via unified likes store.
 */
export default function CompanyLikeButton({
  companyId,
  company: _company = null,
  initialLiked = false,
  initialLikesCount = 0,
  onChange,
  className,
  showCount = true,
}) {
  const t = useTranslations("company");
  const [likesCount, setLikesCount] = useState(Number(initialLikesCount) || 0);

  useEffect(() => {
    setLikesCount(Number(initialLikesCount) || 0);
  }, [companyId, initialLikesCount]);

  const { liked, toggleLike, loading, isLikesLoading } = useLikeToggle({
    type: "company",
    id: companyId,
    initialLiked,
    initialLikesCount: likesCount,
    onChange: (next) => {
      setLikesCount(next.likesCount);
      onChange?.(next);
    },
  });

  const showLoading = loading || isLikesLoading;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={liked ? t("unlike") : t("like")}
        aria-pressed={liked}
        aria-busy={showLoading}
        disabled={loading}
        className={cn(
          "border-border/60 bg-card shadow-sm hover:border-primary/30",
          liked
            ? "border-destructive/40 text-destructive hover:text-destructive"
            : "text-muted-foreground hover:text-foreground",
        )}
        onClick={() => {
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

      {showCount && (
        <span className="text-sm font-semibold tabular-nums">{likesCount}</span>
      )}
    </div>
  );
}
