"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Building2, Eye, GitCompare } from "lucide-react";

import MediaImage from "@/components/common/MediaImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ViewsCount } from "@/features/browsing";
import { COMPARE_UI_ENABLED } from "@/features/compare";
import ProductLikeButton from "@/features/wishlist/components/ProductLikeButton";
import { LIKE_SOURCE } from "@/features/wishlist/types";
import { cn } from "@/lib/utils";

/**
 * Product detail hero.
 * mode="catalog" — product discovery (no purchase pricing)
 * mode="company" — purchase context with seller company
 */
export default function ProductHero({
  product,
  locale = "ar",
  company = null,
  showOfferingCompanies = true,
  mode,
  /** Server Suspense slot that replaces the default like + count cluster. */
  likeSlot = null,
}) {
  const t = useTranslations("product");
  const currency = locale === "ar" ? "ج.م" : "EGP";
  const [likesCount, setLikesCount] = useState(product?.likesCount ?? 0);
  const [likesSyncKey, setLikesSyncKey] = useState(
    `${product?.id}-${product?.likesCount ?? 0}`,
  );
  const nextLikesSyncKey = `${product?.id}-${product?.likesCount ?? 0}`;
  if (nextLikesSyncKey !== likesSyncKey) {
    setLikesSyncKey(nextLikesSyncKey);
    setLikesCount(product?.likesCount ?? 0);
  }

  const resolvedMode =
    mode ?? (company || !showOfferingCompanies ? "company" : "catalog");
  const isCatalog = resolvedMode === "catalog";

  if (!product) return null;

  const showSalePrice =
    !isCatalog &&
    product.isOnSale &&
    product.originalPrice != null &&
    product.originalPrice > product.cashPrice;

  const isOutOfStock =
    product.isAvailable === false || product.stockStatus === "out_of_stock";

  const likeSource =
    product.likeSource ??
    product.source ??
    (product.companyId != null ? LIKE_SOURCE.COMPANY : LIKE_SOURCE.CATALOG);

  const likeCompanyId =
    likeSource === LIKE_SOURCE.COMPANY
      ? (product.companyId ?? company?.id ?? null)
      : null;

  const eyebrow = isCatalog
    ? product.category?.name || null
    : company?.name || product.category?.name || null;

  return (
    <div className="grid items-start gap-6 md:gap-8 lg:grid-cols-[minmax(0,18rem)_1fr] xl:grid-cols-[minmax(0,20rem)_1fr]">
      <div className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
        <motion.div
          initial={false}
          className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border/60 bg-card gradient-water sm:rounded-3xl"
        >
          <MediaImage
            src={product.image}
            alt={product.name}
            kind="product"
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 320px"
          />

          <div className="absolute start-3 top-3 z-[2] flex flex-col gap-1.5">
            {!isCatalog && product.isOnSale && (
              <Badge variant="destructive" className="rounded-full px-2.5 py-0.5">
                {t("badges.sale")}
              </Badge>
            )}
            {!isCatalog && product.hasInstallment && (
              <Badge className="rounded-full px-2.5 py-0.5">
                {t("badges.installment")}
              </Badge>
            )}
            {!isCatalog && product.hasPerks && (
              <Badge variant="secondary" className="rounded-full px-2.5 py-0.5">
                {t("badges.perks")}
              </Badge>
            )}
            {!isCatalog &&
              (product.source === "catalog" ||
                product.likeSource === "catalog") && (
                <Badge
                  variant="ghost"
                  className="  px-2.5 py-0.5"
                >
                  {t("badges.watfilProduct")}
                </Badge>
              )}
            {!isCatalog &&
              (product.source === "company" ||
                product.likeSource === "company") && (
                <Badge className="rounded-full bg-primary/15 px-2.5 py-0.5 text-primary">
                  {t("badges.companyProduct")}
                </Badge>
              )}
            {isOutOfStock ? (
              <Badge
                variant="outline"
                className="rounded-full bg-card/90 px-2.5 py-0.5"
              >
                {t("availability.unavailable")}
              </Badge>
            ) : (
              <Badge className="rounded-full border-0 bg-primary px-2.5 py-0.5 text-primary-foreground">
                {t("availability.available")}
              </Badge>
            )}
          </div>
        </motion.div>
      </div>

      <div className="min-w-0">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
        )}

        <h1 className="mt-1.5 text-2xl font-black leading-tight tracking-tight md:text-3xl">
          {product.name}
        </h1>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Eye className="h-4 w-4 shrink-0" aria-hidden />
          <ViewsCount
            value={product.viewsCount ?? 0}
            numberClassName="font-semibold text-foreground"
          />
          <span>{t("views")}</span>
        </div>

        {product.sku && (
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t("sku")}:{" "}
            <span className="font-semibold text-foreground">{product.sku}</span>
          </p>
        )}

        {(product.productType?.label || product.numberOfStages != null) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.productType?.label && (
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {product.productType.label}
              </Badge>
            )}
            {product.numberOfStages != null && (
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {t("stagesCount", { count: product.numberOfStages })}
              </Badge>
            )}
          </div>
        )}

        {product.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {product.description}
          </p>
        )}

        <div className="mt-5 space-y-3">
          {!isCatalog && (
            <div className="rounded-2xl p-4 gradient-water sm:rounded-3xl sm:p-5">
              <div className="text-xs text-muted-foreground">{t("price")}</div>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-3xl font-black gradient-text md:text-4xl">
                  {product.cashPrice.toLocaleString(
                    locale === "ar" ? "ar-EG" : "en-EG",
                  )}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {currency}
                </span>
                {showSalePrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString(
                      locale === "ar" ? "ar-EG" : "en-EG",
                    )}
                  </span>
                )}
              </div>
            </div>
          )}

          {isCatalog && product.offeringCompaniesCount > 0 && (
            <div className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary sm:size-12 sm:rounded-2xl">
                <Building2 className="size-5" aria-hidden />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  {t("availableFrom")}
                </div>
                <div className="mt-0.5 text-base font-bold tracking-tight sm:text-lg">
                  {t("companiesCount", {
                    count: product.offeringCompaniesCount,
                  })}
                </div>
              </div>
            </div>
          )}

          {company && (
            <div className="flex items-center gap-3  p-4 sm:gap-4  sm:p-5">
              <div
                className={cn(
                  "size-10 shrink-0 overflow-hidden rounded-xl border border-border/60 sm:size-12 sm:rounded-2xl",
                  company.hasLogo ? "bg-muted" : "gradient-water",
                )}
              >
                <MediaImage
                  src={company.hasLogo ? company.logo : null}
                  alt=""
                  kind="company"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{t("soldBy")}</div>
                <div className="mt-0.5 truncate text-base font-bold tracking-tight sm:text-lg">
                  {company.name}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {likeSlot ?? (
            <div className="flex items-center gap-2">
              <ProductLikeButton
                productId={product.id}
                source={likeSource}
                companyId={likeCompanyId}
                initialLiked={product.isLiked ?? product.isWishlisted}
                initialLikesCount={product.likesCount ?? 0}
                onChange={(next) => setLikesCount(next.likesCount)}
                className="size-10"
              />
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold tabular-nums text-foreground">
                  {likesCount}
                </span>{" "}
                {t("likes")}
              </span>
            </div>
          )}

          {COMPARE_UI_ENABLED ? (
            <Button
              type="button"
              variant="outline"
              size="lg"
              aria-pressed={product.isInCompare}
              className={cn(
                "gap-2",
                product.isInCompare && "border-primary/40 text-primary",
              )}
            >
              <GitCompare className="h-4 w-4" aria-hidden />
              {t("compare")}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
