"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  Building2,
  Eye,
  GitCompare,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductLikeButton from "@/features/wishlist/components/ProductLikeButton";
import { LIKE_SOURCE } from "@/features/wishlist/types";
import { cn } from "@/lib/utils";

function RatingStars({ value = 0 }) {
  const full = Math.round(Number(value) || 0);

  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "h-4 w-4",
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
 * Product detail hero — gallery + primary purchase context.
 *
 * @param {object} props
 * @param {object} props.product
 * @param {string} [props.locale]
 * @param {object} [props.company] Seller company context (company offer page)
 * @param {boolean} [props.showOfferingCompanies]
 */
export default function ProductHero({
  product,
  locale = "ar",
  company = null,
  showOfferingCompanies = true,
}) {
  const t = useTranslations("product");
  const currency = locale === "ar" ? "ج.م" : "EGP";
  const [likesCount, setLikesCount] = useState(product?.likesCount ?? 0);

  useEffect(() => {
    setLikesCount(product?.likesCount ?? 0);
  }, [product?.id, product?.likesCount]);

  if (!product) return null;

  const showSalePrice =
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

  const priceLabel = company ? t("price") : t("startingFrom");
  const eyebrow =
    company?.name || product.supplier?.name || product.category?.name || null;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square overflow-hidden rounded-3xl border border-border/60 bg-card gradient-water"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />

          <div className="absolute start-4 top-4 z-[2] flex flex-col gap-2">
            {product.isOnSale && (
              <Badge variant="destructive" className="rounded-full px-3 py-1">
                {t("badges.sale")}
              </Badge>
            )}
            {product.hasInstallment && (
              <Badge className="rounded-full px-3 py-1">
                {t("badges.installment")}
              </Badge>
            )}
            {product.hasPerks && (
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {t("badges.perks")}
              </Badge>
            )}
            {isOutOfStock ? (
              <Badge
                variant="outline"
                className="rounded-full bg-card/90 px-3 py-1"
              >
                {t("availability.unavailable")}
              </Badge>
            ) : (
              <Badge className="rounded-full border-0 bg-primary px-3 py-1 text-primary-foreground">
                {t("availability.available")}
              </Badge>
            )}
          </div>
        </motion.div>
      </div>

      <div>
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
        )}

        <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight md:text-4xl">
          {product.name}
        </h1>

        {product.sku && (
          <p className="mt-2 text-sm text-muted-foreground">
            {t("sku")}:{" "}
            <span className="font-semibold text-foreground">{product.sku}</span>
          </p>
        )}

        {(product.rating != null || product.reviews > 0) && (
          <div className="mt-4 flex items-center gap-3">
            <RatingStars value={product.rating ?? 0} />
            <span className="text-sm font-semibold">
              {product.rating != null ? product.rating.toFixed(1) : "--"}
            </span>
            <span className="text-sm text-muted-foreground">
              ({product.reviews} {t("reviewsCount")})
            </span>
          </div>
        )}

        {product.description && (
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="mt-8 space-y-3">
          <div className="rounded-3xl p-6 gradient-water">
            <div className="text-xs text-muted-foreground">{priceLabel}</div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-4xl font-black gradient-text">
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

          {showOfferingCompanies && product.offeringCompaniesCount > 0 && (
            <div className="flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-5">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Building2 className="size-5" aria-hidden />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">
                  {t("availableFrom")}
                </div>
                <div className="mt-0.5 text-lg font-bold tracking-tight">
                  {t("companiesCount", {
                    count: product.offeringCompaniesCount,
                  })}
                </div>
              </div>
            </div>
          )}

          {company && (
            <div className="flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-5">
              <div
                className={cn(
                  "size-12 shrink-0 overflow-hidden rounded-2xl border border-border/60",
                  company.hasLogo ? "bg-muted" : "gradient-water",
                )}
              >
                <img
                  src={company.logo}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">
                  {t("soldBy")}
                </div>
                <div className="mt-0.5 truncate text-lg font-bold tracking-tight">
                  {company.name}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
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

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" aria-hidden />
            <span className="font-semibold tabular-nums text-foreground">
              {product.viewsCount}
            </span>
            <span>{t("views")}</span>
          </div>
        </div>

        {(product.productType?.label || product.numberOfStages != null) && (
          <div className="mt-8 flex flex-wrap gap-2">
            {product.productType?.label && (
              <Badge variant="secondary" className="rounded-full px-3 py-1.5">
                {product.productType.label}
              </Badge>
            )}
            {product.numberOfStages != null && (
              <Badge variant="secondary" className="rounded-full px-3 py-1.5">
                {t("stagesCount", { count: product.numberOfStages })}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
