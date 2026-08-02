"use client";

import { Eye } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import MediaImage from "@/components/common/MediaImage";
import { Link } from "@/i18n/navigation";
import ViewsCount from "@/features/browsing/components/ViewsCount";
import { formatBrowsingTime } from "@/features/browsing/utils/format-browsing-time";
import { buildCompanyProductHref } from "@/features/companies/utils/resolve-company-product-params";
import { cn } from "@/lib/utils";

/**
 * Compact card for a recently viewed product row.
 */
export default function RecentProductCard({ item, className }) {
  const t = useTranslations("browsing");
  const locale = useLocale();
  const currency = locale === "ar" ? "ج.م" : "EGP";

  if (!item?.product) return null;

  const { product, company, companyId, lastViewedAt } = item;
  const href =
    companyId && product.id
      ? buildCompanyProductHref(companyId, product.id, {
          source: product.source ?? "catalog",
        })
      : `/products/${product.id}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <MediaImage
          src={product.image}
          alt={product.name}
          kind="product"
          sizes="(max-width: 640px) 86vw, (max-width: 1024px) 40vw, 25vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary sm:text-base">
          {product.name}
        </h3>

        {company?.name ? (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {company.name}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
          <div className="flex flex-wrap items-baseline gap-1">
            {product.cashPrice > 0 ? (
              <>
                <span className="text-base font-bold text-primary sm:text-lg">
                  {product.cashPrice.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">{currency}</span>
              </>
            ) : (
              <span className="text-xs font-medium text-primary">
                {t("viewProduct")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="size-3.5 shrink-0" aria-hidden />
            <ViewsCount
              value={product.viewsCount ?? 0}
              numberClassName="font-semibold text-foreground"
            />
          </div>
        </div>

        {lastViewedAt ? (
          <p className="text-[11px] text-muted-foreground">
            {t("lastViewed", {
              time: formatBrowsingTime(lastViewedAt, locale),
            })}
          </p>
        ) : null}
      </div>

      <Link
        href={href}
        className="absolute inset-0 z-[1]"
        aria-label={product.name}
      />
    </article>
  );
}
