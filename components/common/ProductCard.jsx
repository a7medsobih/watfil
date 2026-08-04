"use client";

import { useState } from "react";
import { Eye, GitCompare, Heart, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import MediaImage from "@/components/common/MediaImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ViewsCount } from "@/features/browsing";
import { COMPARE_UI_ENABLED, useCompareToggle } from "@/features/compare";
import { buildCompanyProductHref } from "@/features/companies/utils/resolve-company-product-params";
import { useExperience } from "@/features/experience";
import { EXPERIENCE } from "@/features/experience/constants";
import { buildCatalogProductHref } from "@/features/products/utils/resolve-product-detail-params";
import ProductLikeButton from "@/features/wishlist/components/ProductLikeButton";
import { LIKE_SOURCE } from "@/features/wishlist/types";
import { cn } from "@/lib/utils";

function PerkBadges({ perks = [] }) {
  const visible = perks.slice(0, 3);
  if (!visible.length) return null;

  const overflow = perks.length - visible.length;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {visible.map((perk) => (
        <Badge
          key={perk.id ?? `${perk.title}-${perk.icon}`}
          variant="secondary"
          className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
        >
          {perk.title}
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge
          variant="outline"
          className="rounded-full px-2 py-0.5 text-[11px] text-muted-foreground"
        >
          +{overflow}
        </Badge>
      )}
    </div>
  );
}

/**
 * Product card.
 * - variant="catalog": Watfil discovery card (no purchase data)
 * - variant="company": company-store / offer card (may show price & perks)
 */
export default function ProductCard({
  product,
  locale = "ar",
  className = "",
  onLikeChange,
  variant,
  companyId = null,
  href: hrefOverride = null,
  governorate = null,
}) {
  const t = useTranslations("product");
  const { isCampaign } = useExperience();
  const likeSource =
    product.likeSource ??
    product.source ??
    (product.companyId != null ? LIKE_SOURCE.COMPANY : LIKE_SOURCE.CATALOG);

  // Prefer explicit store context; otherwise only company-sourced products.
  const routeCompanyId =
    companyId ??
    (likeSource === LIKE_SOURCE.COMPANY ? product.companyId : null);

  const resolvedVariant =
    variant ??
    (likeSource === LIKE_SOURCE.COMPANY || routeCompanyId
      ? "company"
      : "catalog");
  const isCatalogVariant = resolvedVariant === "catalog";

  const [likesCount, setLikesCount] = useState(product.likesCount ?? 0);
  const [likesSyncKey, setLikesSyncKey] = useState(
    `${product.id}-${product.source}-${product.likesCount ?? 0}`,
  );
  const nextLikesSyncKey = `${product.id}-${product.source}-${product.likesCount ?? 0}`;
  if (nextLikesSyncKey !== likesSyncKey) {
    setLikesSyncKey(nextLikesSyncKey);
    setLikesCount(product.likesCount ?? 0);
  }

  const { toggle: toggleCompare, isInCompare } = useCompareToggle();
  const inCompare = isInCompare(product.id);

  const isCatalogSource =
    (product.source ?? likeSource) === LIKE_SOURCE.CATALOG;
  const isOutOfStock =
    product.isAvailable === false || product.stockStatus === "out_of_stock";
  const perks = product.hasPerks ? (product.perks ?? []) : [];

  const showSalePrice =
    !isCatalogVariant &&
    product.isOnSale &&
    product.originalPrice != null &&
    product.originalPrice > product.cashPrice;

  const href =
    hrefOverride ??
    (routeCompanyId && product.id
      ? buildCompanyProductHref(routeCompanyId, product.id, {
        source: product.source ?? likeSource ?? "catalog",
        experience: isCampaign ? EXPERIENCE.CAMPAIGN : undefined,
      })
      : buildCatalogProductHref(product, { governorate }));

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <MediaImage
          src={product.image}
          alt={product.name}
          kind="product"
          width={900}
          height={900}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute start-3 top-3 z-[2] flex flex-col gap-2">
          {!isCatalogVariant && product.hasInstallment && (
            <Badge className="rounded-full">{t("badges.installment")}</Badge>
          )}
          {!isCatalogVariant && product.isOnSale && (
            <Badge variant="destructive" className="rounded-full">
              {t("badges.sale")}
            </Badge>
          )}
          {!isCatalogVariant && isCatalogSource && (
            <Badge
              variant="secondary"
              className="rounded-full border border-primary/15 bg-card/90 text-foreground backdrop-blur-sm"
            >
              {t("badges.approvedProduct")}
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="outline" className="rounded-full bg-card/90">
              {t("availability.unavailable")}
            </Badge>
          )}
        </div>

        <div className="absolute end-3 top-3 z-[2] flex flex-col gap-2">
          <ProductLikeButton
            productId={product.id}
            source={likeSource}
            companyId={routeCompanyId}
            initialLiked={product.isLiked ?? product.isWishlisted}
            initialLikesCount={product.likesCount ?? 0}
            onChange={(next) => {
              setLikesCount(next.likesCount);
              onLikeChange?.(next);
            }}
          />

          {COMPARE_UI_ENABLED && isCatalogVariant && isCatalogSource ? (
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t("compare")}
              aria-pressed={inCompare}
              className={cn(
                "border-border/60 bg-card/75 shadow-sm backdrop-blur-sm hover:border-primary/30 hover:bg-card",
                inCompare
                  ? "border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCompare(product);
              }}
            >
              <GitCompare
                className={cn("h-4 w-4", inCompare && "stroke-[2.25]")}
              />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col py-2 px-4">
        {(product.productType?.label ||
          product.category?.name ||
          product.parentCategoryName) && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {product.productType?.label ? (
                <Badge
                  variant="secondary"
                  className="rounded-full bg-primary/10 text-primary"
                >
                  {product.productType.label}
                </Badge>
              ) : null}
              {product.parentCategoryName ? (
                <Badge variant="outline" className="rounded-full">
                  {product.parentCategoryName}
                </Badge>
              ) : null}
              {product.category?.name ? (
                <Badge variant="ghost" className="rounded-full">
                  {product.category.name}
                </Badge>
              ) : null}
            </div>
          )}

        <h3 className="my-2 line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        {!isCatalogVariant && product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {(product.rating != null || product.reviews > 0) && (
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-warning" />
              <span className="font-semibold">
                {product.rating != null ? product.rating.toFixed(1) : "--"}
              </span>
              <span className="text-muted-foreground">({product.reviews})</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="h-3.5 w-3.5" aria-hidden />
            <span className="font-semibold tabular-nums text-foreground">
              {likesCount}
            </span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            <ViewsCount
              value={product.viewsCount ?? 0}
              numberClassName="font-semibold text-foreground"
            />
          </div>
        </div>

        {perks.length > 0 && <PerkBadges perks={perks} />}

        {isCatalogVariant && product.offeringCompaniesCount > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {t("companiesCount", { count: product.offeringCompaniesCount })}
          </p>
        )}

        <div className="mt-auto pt-5">
          {isCatalogVariant ? (
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 border-t border-border/60 pt-4">
              {product.cashPrice > 0 ? (
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-xl font-bold text-primary">
                    {product.cashPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {locale === "ar" ? "ج.م" : "EGP"}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-semibold text-primary">
                  {t("viewDetails")}
                </span>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-border/60 pt-4">
              <span className="text-xs text-muted-foreground">{t("price")}</span>
              <span className="text-xl font-bold text-primary">
                {product.cashPrice.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                {locale === "ar" ? "ج.م" : "EGP"}
              </span>
              {showSalePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <Link
        href={href || "#"}
        className="absolute inset-0 z-[1]"
        aria-label={product.name}
        aria-disabled={!href || undefined}
        tabIndex={!href ? -1 : undefined}
        onClick={!href ? (event) => event.preventDefault() : undefined}
      />
    </article>
  );
}
