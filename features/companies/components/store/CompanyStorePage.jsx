"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { Package } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import ProductCard from "@/components/common/ProductCard";
import CompanyInfoCard from "@/features/companies/components/store/CompanyInfoCard";
import CompanyServicesSection from "@/features/companies/components/store/CompanyServicesSection";
import CompanyStoreTabs from "@/features/companies/components/store/CompanyStoreTabs";
import { CompanyPersonalizationProvider } from "@/features/companies/context/company-personalization-context";
import { cn } from "@/lib/utils";

const CompanyHeroGallery = dynamic(
  () => import("@/features/companies/components/store/CompanyHeroGallery"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[240px] w-full animate-pulse bg-muted sm:h-[340px] md:h-[440px] lg:h-[500px]" />
    ),
  },
);

/**
 * Composes the public company storefront.
 * Info card overlaps the lower half of the hero slider.
 * Products come from paginated GET /public/companies/{id}/products.
 * Hero slides come from buildHeroSlides (billboards preferred over gallery).
 */
export default function CompanyStorePage({
  company,
  heroSlides = [],
  likeSlot = null,
}) {
  const t = useTranslations("company");
  const locale = useLocale();
  const [view, setView] = useState(company);

  useEffect(() => {
    setView((prev) => ({
      ...company,
      // Keep personalized fields across ISR shell refreshes until hydrator runs.
      myRating: prev?.id === company?.id ? (prev.myRating ?? company.myRating) : company.myRating,
      isLiked: prev?.id === company?.id ? (prev.isLiked ?? company.isLiked) : company.isLiked,
    }));
  }, [company]);

  const applyPersonalization = useCallback((data) => {
    if (!data) return;
    setView((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...(data.myRating !== undefined ? { myRating: data.myRating } : {}),
        ...(data.isLiked !== undefined ? { isLiked: data.isLiked } : {}),
      };
    });
  }, []);

  if (!view) return null;

  const hasHero = (heroSlides?.length ?? 0) > 0;
  const services = view.services ?? [];
  const products = view.products ?? [];

  return (
    <CompanyPersonalizationProvider onUpdate={applyPersonalization}>
      <div className="pb-16">
        <div className={cn(hasHero && "relative")}>
          {hasHero && (
            <CompanyHeroGallery
              slides={heroSlides}
              companyName={view.name}
            />
          )}

          <div
            className={cn(
              "container",
              hasHero
                ? "relative z-10 -mt-14 space-y-8 sm:-mt-20 sm:space-y-10 md:-mt-24"
                : "space-y-8 pt-6 sm:space-y-10 sm:pt-8",
            )}
          >
            <CompanyInfoCard
              company={view}
              className={hasHero ? "shadow-elegant" : undefined}
              likeSlot={likeSlot}
            />

            <CompanyServicesSection services={services} />

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {t("tabs.store")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("productsSubtitle", { count: products.length })}
                  </p>
                </div>
              </div>

              {products.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard
                      key={`${product.source ?? "product"}-${product.id}-${product.sku ?? ""}`}
                      product={product}
                      locale={locale}
                      variant="company"
                      companySlug={view.slug}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Package className="size-7 sm:size-8" aria-hidden />}
                  title={t("emptyProductsTitle")}
                  description={t("emptyProducts")}
                />
              )}
            </section>

            <CompanyStoreTabs
              company={view}
              onRatingSummaryChange={(summary) => {
                setView((prev) => ({
                  ...prev,
                  rating: summary.rating,
                  reviews: summary.reviews,
                  myRating: summary.myRating,
                }));
              }}
            />
          </div>
        </div>
      </div>
    </CompanyPersonalizationProvider>
  );
}
