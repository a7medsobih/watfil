"use client";

import { useEffect, useState } from "react";
import { GitCompare, Heart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import ProductLikeButton from "@/features/wishlist/components/ProductLikeButton";
import { LIKE_SOURCE } from "@/features/wishlist/types";
import { cn } from "@/lib/utils";

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
    (product.companyId != null ? LIKE_SOURCE.COMPANY : LIKE_SOURCE.CATALOG);

  const [likesCount, setLikesCount] = useState(product.likesCount ?? 0);

  useEffect(() => {
    setLikesCount(product.likesCount ?? 0);
  }, [product.id, product.likesCount]);

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

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-warning" />
            <span className="font-semibold">
              {product.rating != null ? product.rating.toFixed(1) : "--"}
            </span>
            <span className="text-muted-foreground">({product.reviews})</span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <Heart className="h-3.5 w-3.5" aria-hidden />
            <span className="font-semibold tabular-nums text-foreground">
              {likesCount}
            </span>
          </div>
        </div>

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
