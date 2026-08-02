"use client";

import { Eye, Gift, MapPin, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import MediaImage from "@/components/common/MediaImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ViewsCount } from "@/features/browsing";
import { buildCompanyProductHref } from "@/features/companies/utils/resolve-company-product-params";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_CHIPS = 5;
const MAX_OFFER_HIGHLIGHTS = 2;

function isOfferPerk(perk) {
  return (
    perk?.type === "gift" ||
    perk?.type === "other" ||
    perk?.type === "support" ||
    perk?.type === "maintenance"
  );
}

/**
 * Company card for a product offering — optimized for comparing value.
 */
export default function ProductOfferingCompanyCard({
  offering,
  locale = "ar",
  className,
  labels = {},
  selectedGovernorateId = null,
}) {
  const t = useTranslations("product");

  if (!offering?.company) return null;

  const { company, product } = offering;
  const currency = locale === "ar" ? "ج.م" : "EGP";
  const serviceLocationsTotal = company.coverage?.total ?? 0;
  const perks = product?.hasPerks ? (product.perks ?? []) : [];

  const showSalePrice =
    product?.isOnSale &&
    product.originalPrice != null &&
    product.originalPrice > product.cashPrice;

  const buyHref = product?.id
    ? buildCompanyProductHref(company.id, product.id, {
        source: product.source ?? product.likeSource ?? "catalog",
        governorate: selectedGovernorateId,
      })
    : `/companies/${company.id}`;

  const companyHref = `/companies/${company.id}`;

  const benefitChips = [];

  if (product?.hasInstallment) {
    benefitChips.push({
      key: "installment",
      label: labels.installment ?? t("badges.installment"),
      highlight: true,
    });
  }

  if (product?.isOnSale) {
    benefitChips.push({
      key: "sale",
      label: labels.offers ?? t("offers"),
      highlight: true,
    });
  }

  for (const perk of perks) {
    if (!perk?.title) continue;
    benefitChips.push({
      key: perk.id ?? `${perk.type}-${perk.title}`,
      label: perk.title,
      highlight:
        isOfferPerk(perk) ||
        perk.type === "warranty" ||
        perk.type === "installation",
    });
  }

  const visibleChips = benefitChips.slice(0, MAX_VISIBLE_CHIPS);
  const overflowCount = Math.max(0, benefitChips.length - visibleChips.length);

  const offerHighlights = perks
    .filter((perk) => isOfferPerk(perk) && perk.title)
    .slice(0, MAX_OFFER_HIGHLIGHTS);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card sm:rounded-3xl",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "size-12 shrink-0 overflow-hidden rounded-xl border border-border/60",
              company.hasLogo ? "bg-muted" : "gradient-water",
            )}
          >
            <MediaImage
              src={company.hasLogo ? company.logo : null}
              alt=""
              kind="company"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="line-clamp-1 text-base font-bold tracking-tight transition-colors group-hover:text-primary sm:text-lg">
                {company.name}
              </h3>
              {company.verified && (
                <Badge className="rounded-full px-2 py-0 text-[11px]">
                  {labels.verified ?? t("verified")}
                </Badge>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {company.rating != null && (
                <div className="flex items-center gap-1">
                  <Star
                    className="size-3.5 fill-warning text-warning"
                    aria-hidden
                  />
                  <span className="font-semibold tabular-nums">
                    {Number(company.rating).toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({company.reviews ?? 0})
                  </span>
                </div>
              )}
              {company.governorate?.name && (
                <p className="inline-flex items-center gap-1 text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" aria-hidden />
                  <span className="line-clamp-1">{company.governorate.name}</span>
                </p>
              )}
              {serviceLocationsTotal > 0 && (
                <span className="text-muted-foreground">
                  {t("branchesCount", { count: serviceLocationsTotal })}
                </span>
              )}
            </div>
          </div>
        </div>

        {product && (
          <div>
            <div className="text-xs text-muted-foreground">
              {labels.price ?? t("price")}
            </div>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-xl font-bold text-primary tabular-nums sm:text-2xl">
                {product.cashPrice.toLocaleString(
                  locale === "ar" ? "ar-EG" : "en-EG",
                )}
              </span>
              <span className="text-sm text-muted-foreground">{currency}</span>
              {showSalePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString(
                    locale === "ar" ? "ar-EG" : "en-EG",
                  )}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="size-3.5 shrink-0" aria-hidden />
              <ViewsCount
                value={product.viewsCount ?? 0}
                numberClassName="font-semibold text-foreground"
              />
              <span>{t("views")}</span>
            </div>
          </div>
        )}

        {visibleChips.length > 0 && (
          <div className="flex flex-wrap gap-1.5" aria-label={t("tabs.perks")}>
            {visibleChips.map((chip) => (
              <Badge
                key={chip.key}
                variant="secondary"
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  chip.highlight
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-foreground",
                )}
              >
                {chip.label}
              </Badge>
            ))}
            {overflowCount > 0 && (
              <Badge
                variant="secondary"
                className="rounded-full px-2.5 py-1 text-xs text-muted-foreground"
              >
                {t("moreBenefits", { count: overflowCount })}
              </Badge>
            )}
          </div>
        )}

        {offerHighlights.length > 0 && (
          <div className="space-y-2 rounded-2xl border border-primary/15 bg-primary/5 p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Gift className="size-3.5" aria-hidden />
              {labels.offers ?? t("offers")}
            </div>
            <ul className="space-y-1.5">
              {offerHighlights.map((perk) => (
                <li
                  key={perk.id ?? perk.title}
                  className="text-sm leading-snug"
                >
                  <span className="font-semibold">{perk.title}</span>
                  {perk.description ? (
                    <span className="mt-0.5 block line-clamp-1 text-xs text-muted-foreground">
                      {perk.description}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href={buyHref}>{labels.buyNow ?? t("buyNow")}</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={companyHref}>
              {labels.browseCompany ?? t("browseCompany")}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
