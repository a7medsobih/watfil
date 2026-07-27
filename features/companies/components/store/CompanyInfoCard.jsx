"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, Heart, MapPin, Package, Star } from "lucide-react";

import MediaImage from "@/components/common/MediaImage";
import { Badge } from "@/components/ui/badge";
import CompanyLikeButton from "@/features/companies/components/store/CompanyLikeButton";
import { cn } from "@/lib/utils";

function RatingStars({ value = 0 }) {
  const full = Math.round(Number(value) || 0);

  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "size-4",
            index < full
              ? "fill-warning text-warning"
              : "text-muted-foreground/35",
          )}
        />
      ))}
    </div>
  );
}

/**
 * Identity card under the gallery — quick snapshot before browsing the store.
 */
export default function CompanyInfoCard({ company, className, likeSlot = null }) {
  const t = useTranslations("company");
  const [likesCount, setLikesCount] = useState(company?.likes ?? 0);
  const [likesSyncKey, setLikesSyncKey] = useState(
    `${company?.id}-${company?.likes ?? 0}`,
  );
  const nextLikesSyncKey = `${company?.id}-${company?.likes ?? 0}`;
  if (nextLikesSyncKey !== likesSyncKey) {
    setLikesSyncKey(nextLikesSyncKey);
    setLikesCount(company?.likes ?? 0);
  }

  if (!company) return null;

  return (
    <section
      className={cn(
        "rounded-3xl border border-border/60 bg-card p-5 shadow-soft sm:p-6 md:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div
          className={cn(
            "mx-auto flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/60 sm:mx-0 sm:size-24",
            company.hasLogo ? "bg-muted" : "gradient-water",
          )}
        >
          <MediaImage
            src={company.hasLogo ? company.logo : null}
            alt={company.name}
            kind="company"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-4 text-center sm:text-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {company.name}
            </h1>

            {company.governorate?.name && (
              <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" aria-hidden />
                {company.governorate.name}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
            <div className="flex items-center gap-2">
              <RatingStars value={company.rating ?? 0} />
              <span className="text-sm font-semibold tabular-nums">
                {company.rating != null
                  ? Number(company.rating).toFixed(1)
                  : "--"}
              </span>
              <span className="text-sm text-muted-foreground">
                ({company.reviews ?? 0} {t("reviews")})
              </span>
            </div>

            {company.myRating != null && (
              <Badge
                variant="secondary"
                className="rounded-full bg-primary/10 text-primary"
              >
                {t("myRating", {
                  rating: Number(company.myRating).toFixed(1),
                })}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Heart className="size-4" aria-hidden />
              <span className="font-semibold tabular-nums text-foreground">
                {likesCount}
              </span>
              <span>{t("likes")}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="size-4" aria-hidden />
              <span className="font-semibold tabular-nums text-foreground">
                {company.viewsCount ?? 0}
              </span>
              <span>{t("views")}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Package className="size-4" aria-hidden />
              <span className="font-semibold tabular-nums text-foreground">
                {company.productsCount ?? company.products?.length ?? 0}
              </span>
              <span>{t("productsCount")}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-center sm:justify-end">
          {likeSlot ?? (
            <CompanyLikeButton
              companyId={company.id}
              company={company}
              initialLiked={company.isLiked}
              initialLikesCount={company.likes ?? 0}
              showCount={false}
              onChange={(next) => setLikesCount(next.likesCount)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
