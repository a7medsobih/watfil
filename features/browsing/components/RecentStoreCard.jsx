"use client";

import { Eye, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import MediaImage from "@/components/common/MediaImage";
import { Link } from "@/i18n/navigation";
import ViewsCount from "@/features/browsing/components/ViewsCount";
import { formatBrowsingTime } from "@/features/browsing/utils/format-browsing-time";
import { cn } from "@/lib/utils";

/**
 * Compact card for a recently visited store row.
 */
export default function RecentStoreCard({ item, className }) {
  const t = useTranslations("browsing");
  const locale = useLocale();

  if (!item?.company) return null;

  const { company, lastVisitedAt } = item;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card",
        className,
      )}
    >
      <div
        className={cn(
          "relative h-36 overflow-hidden sm:h-40",
          company.hasLogo ? "bg-muted" : "gradient-water",
        )}
      >
        <MediaImage
          src={company.hasLogo ? company.logo : null}
          alt={company.name}
          kind="company"
          sizes="(max-width: 640px) 86vw, (max-width: 1024px) 40vw, 25vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
      </div>

      <div className="space-y-2 p-4 sm:p-5">
        <h3 className="line-clamp-1 text-base font-semibold transition-colors group-hover:text-primary">
          {company.name}
        </h3>

        {company.governorate?.name ? (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="line-clamp-1">{company.governorate.name}</span>
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="size-3.5 shrink-0" aria-hidden />
            <ViewsCount
              value={company.viewsCount ?? 0}
              numberClassName="font-semibold text-foreground"
            />
            <span>{t("views")}</span>
          </div>

          {lastVisitedAt ? (
            <p className="text-[11px] text-muted-foreground">
              {t("lastVisited", {
                time: formatBrowsingTime(lastVisitedAt, locale),
              })}
            </p>
          ) : null}
        </div>
      </div>

      <Link
        href={`/companies/${company.id}`}
        className="absolute inset-0 z-[1]"
        aria-label={company.name}
      />
    </article>
  );
}
