"use client";

import { useTranslations } from "next-intl";

import LazySectionCarousel from "@/components/common/LazySectionCarousel";
import SectionHeader from "@/components/common/SectionHeader";
import { ProductCardSkeletonGrid } from "@/components/skeletons";
import EmptyRecentlyViewed from "@/features/browsing/components/EmptyRecentlyViewed";
import RecentProductCard from "@/features/browsing/components/RecentProductCard";
import RecentStoreCard from "@/features/browsing/components/RecentStoreCard";
import { useRecentProducts } from "@/features/browsing/hooks/use-recent-products";
import { useRecentStores } from "@/features/browsing/hooks/use-recent-stores";
import { cn } from "@/lib/utils";

/**
 * Recently viewed products + visited stores.
 *
 * @param {"home" | "account"} [variant]
 * @param {boolean} [showEmpty] Show empty state when account has no history.
 * @param {boolean} [showStores] Include recently visited stores block.
 * @param {boolean} [contained] Wrap in `.container` (disable inside existing containers).
 */
export default function RecentlyViewedSection({
  variant = "home",
  showEmpty = false,
  showStores = true,
  contained = true,
  limit = 12,
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
  } = useRecentStores({
    limit,
    enabled: showStores,
  });

  const isLoading = productsLoading || (showStores && storesLoading);
  const hasProducts = products.length > 0;
  const hasStores = showStores && stores.length > 0;
  const hasAny = hasProducts || hasStores;
  const sectionClass = cn(contained && "container", "py-10", className);

  if (isLoading) {
    return (
      <section className={sectionClass}>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <ProductCardSkeletonGrid count={4} />
      </section>
    );
  }

  if (!hasAny) {
    if (!showEmpty) return null;

    return (
      <section className={sectionClass}>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <EmptyRecentlyViewed variant="products" />
      </section>
    );
  }

  return (
    <section className={sectionClass}>
      {hasProducts ? (
        <>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={
              variant === "account" ? t("accountSubtitle") : t("subtitle")
            }
          />
          <LazySectionCarousel ariaLabel={t("title")}>
            {products.map((item) => (
              <RecentProductCard
                key={`${item.companyId}-${item.product.id}-${item.product.source}`}
                item={item}
                className="h-full"
              />
            ))}
          </LazySectionCarousel>
        </>
      ) : null}

      {hasStores ? (
        <div className={cn(hasProducts && "mt-12 md:mt-14")}>
          <SectionHeader
            eyebrow={hasProducts ? undefined : t("eyebrow")}
            title={t("storesTitle")}
            subtitle={t("storesSubtitle")}
          />
          <LazySectionCarousel ariaLabel={t("storesTitle")}>
            {stores.map((item) => (
              <RecentStoreCard
                key={item.company.id}
                item={item}
                className="h-full"
              />
            ))}
          </LazySectionCarousel>
        </div>
      ) : null}
    </section>
  );
}
