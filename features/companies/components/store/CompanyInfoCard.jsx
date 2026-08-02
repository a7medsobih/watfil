"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  Eye,
  Globe2,
  Heart,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";

import MediaImage from "@/components/common/MediaImage";
import { Badge } from "@/components/ui/badge";
import { ViewsCount } from "@/features/browsing";
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

  const coverageNames = useMemo(
    () => (company.coverageAreas ?? []).map((item) => item.name).filter(Boolean),
    [company.coverageAreas],
  );

  const metrics = [
    {
      key: "products",
      label: t("productsCount"),
      value: company.productsCount ?? company.products?.length ?? 0,
      Icon: Package,
    },
    {
      key: "views",
      label: t("views"),
      value: company.viewsCount ?? 0,
      Icon: Eye,
    },
    {
      key: "likes",
      label: t("likes"),
      value: likesCount,
      Icon: Heart,
    },
    {
      key: "ratings",
      label: t("reviews"),
      value: company.reviews ?? 0,
      Icon: BarChart3,
    },
  ];

  if (!company) return null;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft",
        className,
      )}
    >
      <div className="bg-linear-to-br from-primary/[0.08] via-card to-accent-mint/[0.08] p-5 sm:p-6 md:p-8">
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
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {company.name}
                </h1>
                {company.verified ? (
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-primary/10 text-primary"
                  >
                    <ShieldCheck className="size-3.5" aria-hidden />
                    {t("verifiedLabel")}
                  </Badge>
                ) : null}
                {company.isListingAd ? (
                  <Badge variant="outline" className="rounded-full">
                    <TrendingUp className="size-3.5" aria-hidden />
                    {t("listingAdLabel", { position: company.listingAdPosition ?? "-" })}
                  </Badge>
                ) : null}
              </div>

              {company.governorate?.name ? (
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" aria-hidden />
                  {company.governorate.name}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {company.coversAllGovernorates ? (
                  <Badge className="rounded-full">
                    <Globe2 className="size-3.5" aria-hidden />
                    {t("coversAllGovernoratesLabel")}
                  </Badge>
                ) : null}
                {!company.coversAllGovernorates && coverageNames.length > 0 ? (
                  <Badge variant="secondary" className="rounded-full">
                    {t("serviceAreasCount", { count: coverageNames.length })}
                  </Badge>
                ) : null}
              </div>
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

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Eye className="size-4 shrink-0" aria-hidden />
                <ViewsCount
                  value={company.viewsCount ?? 0}
                  numberClassName="font-semibold text-foreground"
                />
                <span>{t("views")}</span>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Heart className="size-4 shrink-0" aria-hidden />
                <span className="font-semibold tabular-nums text-foreground">
                  {likesCount}
                </span>
                <span>{t("likes")}</span>
              </div>

              {company.myRating != null ? (
                <Badge
                  variant="secondary"
                  className="rounded-full bg-primary/10 text-primary"
                >
                  {t("myRating", {
                    rating: Number(company.myRating).toFixed(1),
                  })}
                </Badge>
              ) : null}
            </div>

            {company.about ? (
              <p className="max-w-4xl whitespace-pre-wrap text-sm leading-7 text-muted-foreground sm:text-base">
                {company.about}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">{t("about")} —</p>
            )}
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
      </div>

      <div className="grid gap-3 border-t border-border/60 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4 md:p-8">
        {metrics.map(({ key, label, value, Icon }) => (
          <article
            key={key}
            className="rounded-2xl border border-border/60 bg-background/70 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <Icon className="size-4 text-primary" aria-hidden />
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {key === "views" ? (
                <ViewsCount value={value} />
              ) : (
                value
              )}
            </p>
          </article>
        ))}
      </div>

      {!company.coversAllGovernorates && coverageNames.length > 0 ? (
        <div className="border-t border-border/60 px-5 py-4 sm:px-6 md:px-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("serviceLocations")}
          </p>
          <div className="flex flex-wrap gap-2">
            {coverageNames.map((name) => (
              <Badge key={name} variant="outline" className="rounded-full">
                {name}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
