"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Heart, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/features/auth";
import { likeCompany, unlikeCompany } from "@/features/companies/api";
import { useAuthStore, useIsAuthenticated } from "@/stores/auth-store";
import { useLikedCompaniesStore } from "@/stores/liked-companies-store";
import { cn } from "@/lib/utils";

/**
 * Company like control — mirrors product like UX.
 */
export default function CompanyLikeButton({
  companyId,
  company = null,
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
  const setLikedCompany = useLikedCompaniesStore((state) => state.setLiked);

  const [liked, setLiked] = useState(Boolean(initialLiked));
  const [likesCount, setLikesCount] = useState(Number(initialLikesCount) || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(Boolean(initialLiked));
    setLikesCount(Number(initialLikesCount) || 0);
  }, [initialLiked, initialLikesCount, companyId]);

  useEffect(() => {
    if (!companyId || !initialLiked || !company) return;
    setLikedCompany(
      {
        id: company.id ?? companyId,
        slug: company.slug,
        name: company.name,
        logo: company.logo,
        hasLogo: company.hasLogo,
        rating: company.rating,
        reviews: company.reviews,
        likes: company.likes ?? initialLikesCount,
        governorate: company.governorate,
        coverage: company.coverage,
        verified: company.verified,
      },
      true,
    );
  }, [company, companyId, initialLiked, initialLikesCount, setLikedCompany]);

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

    if (company || companyId) {
      setLikedCompany(
        {
          id: company?.id ?? companyId,
          slug: company?.slug ?? null,
          name: company?.name ?? "",
          logo: company?.logo ?? null,
          hasLogo: Boolean(company?.hasLogo),
          rating: company?.rating ?? null,
          reviews: company?.reviews ?? 0,
          likes: nextCount,
          governorate: company?.governorate ?? null,
          coverage: company?.coverage ?? null,
          verified: Boolean(company?.verified),
        },
        nextLiked,
      );
    }

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
      if (company || companyId) {
        setLikedCompany(
          {
            id: company?.id ?? companyId,
            slug: company?.slug ?? null,
            name: company?.name ?? "",
            logo: company?.logo ?? null,
            hasLogo: Boolean(company?.hasLogo),
            rating: company?.rating ?? null,
            reviews: company?.reviews ?? 0,
            likes: previousCount,
            governorate: company?.governorate ?? null,
            coverage: company?.coverage ?? null,
            verified: Boolean(company?.verified),
          },
          previousLiked,
        );
      }
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
