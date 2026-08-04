"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Building2,
  GitCompare,
  Heart,
  Star,
  Trash2,
  X,
} from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import MediaImage from "@/components/common/MediaImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompareProducts } from "@/features/compare/hooks";
import { buildCatalogProductHref } from "@/features/products/utils/resolve-product-detail-params";
import { Link } from "@/i18n/navigation";
import { MAX_COMPARE_ITEMS } from "@/stores/compare-store";
import { cn } from "@/lib/utils";

function formatMoney(value, currency) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Number(value).toLocaleString()} ${currency}`;
}

function CompareTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
      <div className="grid grid-cols-[minmax(7rem,10rem)_1fr_1fr] gap-px bg-border/40">
        {Array.from({ length: 8 }).map((_, row) => (
          <div key={row} className="contents">
            <div className="bg-card p-4">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="bg-card p-4">
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="bg-card p-4">
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductHeaderCell({ product, currency, onRemove, t }) {
  const href = buildCatalogProductHref(product);
  const showSale =
    product.isOnSale &&
    product.originalPrice != null &&
    product.originalPrice > product.cashPrice;

  return (
    <div className="flex h-full flex-col gap-3 p-4 sm:p-5">
      <div className="relative mx-auto aspect-square w-full max-w-[10rem] overflow-hidden rounded-2xl border border-border/50 bg-muted">
        <MediaImage
          src={product.image}
          alt={product.name}
          kind="product"
          width={320}
          height={320}
          sizes="160px"
          className="object-cover"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="absolute end-2 top-2 border-border/60 bg-card/90 shadow-sm"
          aria-label={t("remove")}
          onClick={() => onRemove(product.id)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="min-w-0 text-start">
        <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground sm:text-base">
          {href ? (
            <Link href={href} className="hover:text-primary">
              {product.name}
            </Link>
          ) : (
            product.name
          )}
        </h2>

        <div className="mt-2">
          {showSale ? (
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-base font-bold tabular-nums text-primary">
                {formatMoney(product.cashPrice, currency)}
              </span>
              <span className="text-xs text-muted-foreground line-through tabular-nums">
                {formatMoney(product.originalPrice, currency)}
              </span>
            </div>
          ) : (
            <span className="text-base font-bold tabular-nums text-foreground">
              {product.cashPrice > 0
                ? formatMoney(product.cashPrice, currency)
                : "—"}
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        {href ? (
          <Button asChild size="sm" className="w-full">
            <Link href={href}>{t("viewProduct")}</Link>
          </Button>
        ) : null}
        {product.offeringCompaniesCount > 0 && href ? (
          <Button asChild variant="outline" size="sm" className="w-full gap-1.5">
            <Link href={`${href}#choose-company`}>
              <Building2 className="h-3.5 w-3.5" aria-hidden />
              {t("offeringCompanies", {
                count: product.offeringCompaniesCount,
              })}
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function SlotHeaderCell({ item, onRemove, t }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4 sm:p-5">
      {item ? (
        <>
          <div className="relative aspect-square w-full max-w-[8rem] overflow-hidden rounded-2xl border border-border/50 bg-muted">
            <MediaImage
              src={item.image}
              alt={item.name || ""}
              kind="product"
              width={240}
              height={240}
              sizes="128px"
            />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="absolute end-2 top-2 border-border/60 bg-card/90"
              aria-label={t("remove")}
              onClick={() => onRemove(item.id)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="line-clamp-2 text-center text-sm font-medium">
            {item.name}
          </p>
          <p className="text-center text-xs text-muted-foreground">
            {t("waitingForSecond")}
          </p>
        </>
      ) : (
        <>
          <div className="grid size-16 place-items-center rounded-2xl border border-dashed border-border/70 bg-muted/40 text-muted-foreground">
            <GitCompare className="size-6" aria-hidden />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {t("emptySlot")}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/products">{t("browseProducts")}</Link>
          </Button>
        </>
      )}
    </div>
  );
}

function CompareRow({ label, values, betterIndex = null }) {
  return (
    <div className="grid grid-cols-[minmax(7rem,10rem)_1fr_1fr] gap-px bg-border/40">
      <div className="bg-muted/40 px-3 py-3 text-xs font-medium text-muted-foreground sm:px-4 sm:text-sm">
        {label}
      </div>
      {values.map((value, index) => (
        <div
          key={index}
          className={cn(
            "bg-card px-3 py-3 text-sm sm:px-4",
            betterIndex === index && "font-semibold text-primary",
          )}
        >
          {value ?? "—"}
        </div>
      ))}
    </div>
  );
}

/**
 * Side-by-side catalog product compare (exactly 2 products via API).
 */
export default function ComparePage() {
  const t = useTranslations("compare");
  const tProduct = useTranslations("product");
  const locale = useLocale();
  const currency = locale === "ar" ? "ج.م" : "EGP";

  const {
    items,
    products,
    isLoading,
    error,
    ready,
    hasHydrated,
    reload,
    remove,
    clear,
  } = useCompareProducts();

  const rows = useMemo(() => {
    if (products.length !== 2) return [];

    const [a, b] = products;
    const stockLabel = (product) => {
      if (product.isAvailable === false) {
        return tProduct("availability.unavailable");
      }
      const status = product.stockStatus;
      if (status === "in_stock" || status === "out_of_stock" || status === "limited") {
        return tProduct(`stock.${status}`);
      }
      return tProduct("availability.available");
    };

    const discountPct = (product) => {
      if (
        !product.isOnSale ||
        product.originalPrice == null ||
        product.originalPrice <= product.cashPrice
      ) {
        return null;
      }
      return Math.round(
        ((product.originalPrice - product.cashPrice) / product.originalPrice) *
          100,
      );
    };

    const da = discountPct(a);
    const db = discountPct(b);
    const priceA = Number(a.cashPrice);
    const priceB = Number(b.cashPrice);
    const companiesA = Number(a.offeringCompaniesCount ?? 0);
    const companiesB = Number(b.offeringCompaniesCount ?? 0);
    const likesA = Number(a.likesCount ?? 0);
    const likesB = Number(b.likesCount ?? 0);

    return [
      {
        key: "price",
        label: t("fields.price"),
        values: [
          formatMoney(a.cashPrice, currency),
          formatMoney(b.cashPrice, currency),
        ],
        betterIndex:
          priceA > 0 && priceB > 0
            ? priceA < priceB
              ? 0
              : priceB < priceA
                ? 1
                : null
            : null,
      },
      {
        key: "original",
        label: t("fields.originalPrice"),
        values: [
          a.originalPrice != null
            ? formatMoney(a.originalPrice, currency)
            : "—",
          b.originalPrice != null
            ? formatMoney(b.originalPrice, currency)
            : "—",
        ],
      },
      {
        key: "discount",
        label: t("fields.discount"),
        values: [
          da != null ? `${da}%` : "—",
          db != null ? `${db}%` : "—",
        ],
        betterIndex:
          da != null && db != null
            ? da > db
              ? 0
              : db > da
                ? 1
                : null
            : null,
      },
      {
        key: "type",
        label: t("fields.productType"),
        values: [a.productType?.label || "—", b.productType?.label || "—"],
      },
      {
        key: "category",
        label: t("fields.category"),
        values: [a.category?.name || "—", b.category?.name || "—"],
      },
      {
        key: "companies",
        label: t("fields.offeringCompanies"),
        values: [String(companiesA), String(companiesB)],
        betterIndex:
          companiesA > companiesB ? 0 : companiesB > companiesA ? 1 : null,
      },
      {
        key: "likes",
        label: t("fields.likes"),
        values: [
          <span key="la" className="inline-flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5" aria-hidden />
            {likesA}
          </span>,
          <span key="lb" className="inline-flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5" aria-hidden />
            {likesB}
          </span>,
        ],
        betterIndex: likesA > likesB ? 0 : likesB > likesA ? 1 : null,
      },
      {
        key: "rating",
        label: t("fields.rating"),
        values: [
          a.rating != null ? (
            <span key="ra" className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
              {a.rating}
              <span className="text-muted-foreground">
                ({a.reviews ?? 0})
              </span>
            </span>
          ) : (
            "—"
          ),
          b.rating != null ? (
            <span key="rb" className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
              {b.rating}
              <span className="text-muted-foreground">
                ({b.reviews ?? 0})
              </span>
            </span>
          ) : (
            "—"
          ),
        ],
      },
      {
        key: "stock",
        label: t("fields.availability"),
        values: [stockLabel(a), stockLabel(b)],
      },
      {
        key: "sku",
        label: t("fields.sku"),
        values: [a.sku || "—", b.sku || "—"],
      },
      {
        key: "supplier",
        label: t("fields.supplier"),
        values: [a.supplier?.name || "—", b.supplier?.name || "—"],
      },
      {
        key: "views",
        label: t("fields.views"),
        values: [String(a.viewsCount ?? 0), String(b.viewsCount ?? 0)],
      },
    ];
  }, [products, currency, t, tProduct]);

  if (!hasHydrated) {
    return <CompareTableSkeleton />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<GitCompare className="size-7 sm:size-8" aria-hidden />}
        title={t("emptyTitle")}
        description={t("empty", { max: MAX_COMPARE_ITEMS })}
        action={
          <Button asChild>
            <Link href="/products">{t("browseProducts")}</Link>
          </Button>
        }
      />
    );
  }

  if (!ready) {
    const [first, second] = [
      items[0] ?? null,
      items[1] ?? null,
    ];

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {t("needTwo", { current: items.length, max: MAX_COMPARE_ITEMS })}
          </p>
          {items.length > 0 ? (
            <Button type="button" variant="ghost" size="sm" onClick={clear}>
              <Trash2 className="me-1.5 h-3.5 w-3.5" aria-hidden />
              {t("clear")}
            </Button>
          ) : null}
        </div>

        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
          <div className="grid grid-cols-1 gap-px bg-border/40 sm:grid-cols-2">
            <div className="bg-card">
              <SlotHeaderCell item={first} onRemove={remove} t={t} />
            </div>
            <div className="bg-card">
              <SlotHeaderCell item={second} onRemove={remove} t={t} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <CompareTableSkeleton />;
  }

  if (error || products.length !== 2) {
    const message =
      error?.status === 404
        ? t("errors.unavailable")
        : error?.status === 422
          ? t("errors.invalid")
          : t("errors.generic");

    return (
      <EmptyState
        icon={<GitCompare className="size-7 sm:size-8" aria-hidden />}
        title={t("errors.title")}
        description={message}
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button type="button" onClick={reload}>
              {t("retry")}
            </Button>
            <Button type="button" variant="outline" onClick={clear}>
              {t("clear")}
            </Button>
          </div>
        }
      />
    );
  }

  const [left, right] = products;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            {t("countBadge", { count: products.length, max: MAX_COMPARE_ITEMS })}
          </Badge>
          {left.isOnSale || right.isOnSale ? (
            <Badge variant="destructive" className="rounded-full">
              {tProduct("badges.sale")}
            </Badge>
          ) : null}
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={clear}>
          <Trash2 className="me-1.5 h-3.5 w-3.5" aria-hidden />
          {t("clear")}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border/60 bg-card shadow-soft">
        <div className="min-w-[36rem]">
          <div className="grid grid-cols-[minmax(7rem,10rem)_1fr_1fr] gap-px bg-border/40">
            <div className="bg-muted/40 p-4 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:p-5">
              {t("fields.product")}
            </div>
            <div className="bg-card">
              <ProductHeaderCell
                product={left}
                currency={currency}
                onRemove={remove}
                t={t}
              />
            </div>
            <div className="bg-card">
              <ProductHeaderCell
                product={right}
                currency={currency}
                onRemove={remove}
                t={t}
              />
            </div>
          </div>

          {rows.map((row) => (
            <CompareRow
              key={row.key}
              label={row.label}
              values={row.values}
              betterIndex={row.betterIndex ?? null}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
