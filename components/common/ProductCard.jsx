"use client";

import { useEffect, useState } from "react";
import { Eye, GitCompare, Heart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import ProductLikeButton from "@/features/wishlist/components/ProductLikeButton";
import { LIKE_SOURCE } from "@/features/wishlist/types";
import { resolveLucideIcon } from "@/features/companies/utils/resolve-lucide-icon";
import { cn } from "@/lib/utils";

function PerkIcons({ perks = [], locale = "en" }) {
  const visible = perks.slice(0, 4);
  if (!visible.length) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      {visible.map((perk) => {
        const Icon = resolveLucideIcon(perk.icon);
        return (
          <span
            key={perk.id ?? `${perk.title}-${perk.icon}`}
            title={perk.title}
            className="inline-flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <Icon className="size-3.5" aria-hidden />
            <span className="sr-only">{perk.title}</span>
          </span>
        );
      })}
      {perks.length > visible.length && (
        <span className="text-xs text-muted-foreground">
          +{perks.length - visible.length}
        </span>
      )}
    </div>
  );
}

export default function ProductCard({
  product,
  locale = "en",
  className = "",
  onLikeChange,
}) {
  const showSalePrice =
    product.isOnSale &&
    product.originalPrice != null &&
    product.originalPrice > product.cashPrice;

  const likeSource =
    product.likeSource ??
    product.source ??
    (product.companyId != null ? LIKE_SOURCE.COMPANY : LIKE_SOURCE.CATALOG);

  const [likesCount, setLikesCount] = useState(product.likesCount ?? 0);

  useEffect(() => {
    setLikesCount(product.likesCount ?? 0);
  }, [product.id, product.likesCount, product.source]);

  const isCatalog = (product.source ?? likeSource) === LIKE_SOURCE.CATALOG;
  const isCompanyProduct =
    (product.source ?? likeSource) === LIKE_SOURCE.COMPANY;
  const isOutOfStock =
    product.isAvailable === false || product.stockStatus === "out_of_stock";
  const perks = product.hasPerks ? (product.perks ?? []) : [];

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={900}
          height={900}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute start-3 top-3 z-[2] flex flex-col gap-2">
          {product.hasInstallment && (
            <Badge className="rounded-full">
              {locale === "ar" ? "تقسيط" : "Installment"}
            </Badge>
          )}
          {product.isOnSale && (
            <Badge variant="destructive" className="rounded-full">
              {locale === "ar" ? "خصم" : "Sale"}
            </Badge>
          )}
          {isCatalog && (
            <Badge
              variant="secondary"
              className="rounded-full bg-card/90 text-foreground backdrop-blur-sm"
            >
              {locale === "ar" ? "كتالوج" : "Catalog"}
            </Badge>
          )}
          {isCompanyProduct && (
            <Badge
              variant="secondary"
              className="rounded-full bg-primary/15 text-primary backdrop-blur-sm"
            >
              {locale === "ar" ? "منتج الشركة" : "Company"}
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="outline" className="rounded-full bg-card/90">
              {locale === "ar" ? "غير متوفر" : "Out of stock"}
            </Badge>
          )}
        </div>

        <div className="absolute end-3 top-3 z-[2] flex flex-col gap-2">
          <ProductLikeButton
            productId={product.id}
            source={likeSource}
            companyId={product.companyId}
            initialLiked={product.isLiked ?? product.isWishlisted}
            initialLikesCount={product.likesCount ?? 0}
            onChange={(next) => {
              setLikesCount(next.likesCount);
              onLikeChange?.(next);
            }}
          />

          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Compare"
            aria-pressed={product.isInCompare}
            className={cn(
              "border-border/60 bg-card/75 shadow-sm backdrop-blur-sm hover:border-primary/30 hover:bg-card",
              product.isInCompare
                ? "border-primary/40 text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <GitCompare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {product.category && (
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {product.category.name}
          </span>
        )}

        <h3 className="my-2 line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        {product.supplier?.name && (
          <div className="mt-3 flex items-center gap-2">
            {product.supplier.logo ? (
              <img
                src={product.supplier.logo}
                alt=""
                loading="lazy"
                className="size-6 rounded-full object-cover ring-1 ring-border/60"
              />
            ) : null}
            <span className="line-clamp-1 text-xs text-muted-foreground">
              {product.supplier.name}
            </span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
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

          {product.viewsCount != null && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" aria-hidden />
              <span className="font-semibold tabular-nums text-foreground">
                {product.viewsCount}
              </span>
            </div>
          )}
        </div>

        {perks.length > 0 && <PerkIcons perks={perks} locale={locale} />}

        {product.offeringCompaniesCount > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {locale === "ar"
              ? `${product.offeringCompaniesCount}  من شركات`
              : `${product.offeringCompaniesCount} offering companies`}
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-border/60 pt-4">
            <span className="text-xs text-muted-foreground">
              {locale === "ar" ? "السعر" : "Price"}
            </span>

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
        </div>
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={product.name}
      />
    </article>
  );
}
