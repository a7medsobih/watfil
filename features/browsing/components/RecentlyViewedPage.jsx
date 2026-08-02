"use client";

import { useTranslations } from "next-intl";
import { History } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import { ProductCardSkeletonGrid } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import EmptyRecentlyViewed from "@/features/browsing/components/EmptyRecentlyViewed";
import RecentProductCard from "@/features/browsing/components/RecentProductCard";
import RecentStoreCard from "@/features/browsing/components/RecentStoreCard";
import { useRecentProducts } from "@/features/browsing/hooks/use-recent-products";
import { useRecentStores } from "@/features/browsing/hooks/use-recent-stores";
import { RECENT_BROWSING_DEFAULT_LIMIT } from "@/features/browsing/constants";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Full recently-viewed page: products + stores in grids.
 */
export default function RecentlyViewedPage({
  limit = RECENT_BROWSING_DEFAULT_LIMIT,
  className,
}) {
  const t = useTranslations("browsing");

  const {
    items: products,
    isLoading: productsLoading,
  } = useRecentProducts({ limit });

  const {
    items: stores,
    isLoading: storesLoading,
  } = useRecentStores({ limit });

  const isLoading = productsLoading || storesLoading;
  const hasProducts = products.length > 0;
  const hasStores = stores.length > 0;

  if (isLoading) {
    return (
      <div className={cn("space-y-12", className)}>
        <ProductCardSkeletonGrid
          count={8}
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        />
      </div>
    );
  }

  if (!hasProducts && !hasStores) {
    return (
      <EmptyState
        icon={<History className="size-7 sm:size-8" aria-hidden />}
        title={t("empty.productsTitle")}
        description={t("empty.productsDescription")}
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/products">{t("empty.browseProducts")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/companies">{t("empty.browseCompanies")}</Link>
            </Button>
          </div>
        }
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-12 md:space-y-14", className)}>
      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            {t("title")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {hasProducts ? (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map((item) => (
              <RecentProductCard
                key={`${item.companyId}-${item.product.id}-${item.product.source}`}
                item={item}
                className="h-full"
              />
            ))}
          </div>
        ) : (
          <EmptyRecentlyViewed variant="products" />
        )}
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            {t("storesTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("storesSubtitle")}
          </p>
        </div>

        {hasStores ? (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {stores.map((item) => (
              <RecentStoreCard
                key={item.company.id}
                item={item}
                className="h-full"
              />
            ))}
          </div>
        ) : (
          <EmptyRecentlyViewed variant="stores" />
        )}
      </section>
    </div>
  );
}
