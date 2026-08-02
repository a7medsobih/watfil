"use client";

import { useState } from "react";
import { Eye, Heart, MapPin, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import MediaImage from "@/components/common/MediaImage";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { ViewsCount } from "@/features/browsing";
import CompanyLikeButton from "@/features/companies/components/store/CompanyLikeButton";
import { cn } from "@/lib/utils";

export default function CompanyCard({
  company,
  className,
  onLikeChange,
}) {
  const t = useTranslations("company");
  const tCompanies = useTranslations("companies");

  const initialLikes = Number(company?.likes ?? company?.likesCount ?? 0) || 0;
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [likesSyncKey, setLikesSyncKey] = useState(
    `${company?.id}-${initialLikes}`,
  );

  if (!company) return null;

  const nextLikesSyncKey = `${company.id}-${company.likes ?? company.likesCount ?? 0}`;
  if (nextLikesSyncKey !== likesSyncKey) {
    setLikesSyncKey(nextLikesSyncKey);
    setLikesCount(Number(company.likes ?? company.likesCount ?? 0) || 0);
  }

  const coverageItems = company.coverage?.items ?? [];
  const coverageOverflow = company.coverage?.overflow ?? 0;
  const coverageTotal = company.coverage?.total ?? 0;
  const hasLogo = company.hasLogo === true;
  const hasCoverageChips =
    coverageItems.length > 0 || company.coversAllGovernorates;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card",
        className,
      )}
    >
      <div className="absolute end-3 top-3 z-[2]">
        <CompanyLikeButton
          companyId={company.id}
          company={company}
          initialLiked={Boolean(company.isLiked)}
          initialLikesCount={likesCount}
          showCount={false}
          onChange={(next) => {
            setLikesCount(next.likesCount);
            onLikeChange?.(next);
          }}
        />
      </div>

      <Link href={`/companies/${company.id}`} className="block">
        <div
          className={cn(
            "relative h-44 overflow-hidden",
            hasLogo ? "bg-muted" : "gradient-water",
          )}
        >
          <MediaImage
            src={hasLogo ? company.logo : null}
            alt={company.name}
            kind="company"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="space-y-4 p-5">
          <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">
            {company.name}
          </h3>

          {company.governorate?.name ? (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{company.governorate.name}</span>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-warning" />
              <span className="font-semibold">
                {company.rating != null
                  ? Number(company.rating).toFixed(1)
                  : "0.0"}
              </span>
              <span className="text-muted-foreground">
                ({company.reviews ?? 0})
              </span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span className="tabular-nums">{likesCount}</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-4 w-4" aria-hidden />
              <ViewsCount
                value={company.viewsCount ?? 0}
                numberClassName="font-medium text-foreground"
              />
            </div>

            {!company.coversAllGovernorates && coverageTotal > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>
                  {t("serviceLocations")} · {coverageTotal}
                </span>
              </div>
            )}
          </div>

          {hasCoverageChips && (
            <div className="flex flex-wrap gap-2">
              {company.coversAllGovernorates ? (
                <Badge
                  variant="secondary"
                  className="rounded-full bg-primary/10 text-primary hover:bg-primary/15"
                >
                  {tCompanies("allGovernorates")}
                </Badge>
              ) : null}

              {coverageItems.map((item) => (
                <Badge
                  key={item.id}
                  variant="secondary"
                  className="rounded-full bg-primary/10 text-primary hover:bg-primary/15"
                >
                  {item.name}
                </Badge>
              ))}

              {coverageOverflow > 0 && (
                <Badge
                  variant="secondary"
                  className="rounded-full bg-primary/10 text-primary hover:bg-primary/15"
                >
                  +{coverageOverflow}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
