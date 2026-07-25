"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Heart, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/features/auth";
import { likeCompany, unlikeCompany } from "@/features/companies/api";
import { useAuthStore, useIsAuthenticated } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

/**
 * Company like control — mirrors product like UX.
 */
export default function CompanyLikeButton({
  companyId,
  initialLiked = false,
  initialLikesCount = 0,
  onChange,
  className,
  showCount = true,
}) {
  const t = useTranslations("company");
  const isAuthenticated = useIsAuthenticated();
  const token = useAuthStore((state) => state.token);
  const { openLogin } = useRequireAuth("login");

  const [liked, setLiked] = useState(Boolean(initialLiked));
  const [likesCount, setLikesCount] = useState(Number(initialLikesCount) || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(Boolean(initialLiked));
    setLikesCount(Number(initialLikesCount) || 0);
  }, [initialLiked, initialLikesCount, companyId]);

  const toggleLike = async () => {
    if (!companyId || loading) return;

    if (!isAuthenticated || !token) {
      openLogin();
      return;
    }

    const previousLiked = liked;
    const previousCount = likesCount;
    const nextLiked = !previousLiked;
    const nextCount = Math.max(0, previousCount + (nextLiked ? 1 : -1));

    setLiked(nextLiked);
    setLikesCount(nextCount);
    onChange?.({ liked: nextLiked, likesCount: nextCount });
    setLoading(true);

    try {
      if (nextLiked) {
        await likeCompany(companyId, token);
        toast.success(t("toast.liked"));
      } else {
        await unlikeCompany(companyId, token);
        toast(t("toast.unliked"));
      }
    } catch {
      setLiked(previousLiked);
      setLikesCount(previousCount);
      onChange?.({ liked: previousLiked, likesCount: previousCount });
      toast.error(t("toast.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={liked ? t("unlike") : t("like")}
        aria-pressed={liked}
        disabled={loading}
        className={cn(
          "border-border/60 bg-card shadow-sm hover:border-primary/30",
          liked
            ? "border-destructive/40 text-destructive hover:text-destructive"
            : "text-muted-foreground hover:text-foreground",
        )}
        onClick={toggleLike}
      >
        {loading ? (
          <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden />
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
