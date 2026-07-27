"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import DownloadAppPromo from "@/components/common/DownloadAppPromo";
import CompanyInfoCard from "@/features/companies/components/store/CompanyInfoCard";
import CompanyStoreTabs from "@/features/companies/components/store/CompanyStoreTabs";
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
 */
export default function CompanyStorePage({
  company,
  productsMeta = null,
  paginationLabels = {},
}) {
  const [view, setView] = useState(company);

  useEffect(() => {
    setView(company);
  }, [company]);

  if (!view) return null;

  const hasGallery = (view.gallery?.length ?? 0) > 0;

  return (
    <div className="pb-16">
      <div className={cn(hasGallery && "relative")}>
        {hasGallery && (
          <CompanyHeroGallery
            images={view.gallery}
            companyName={view.name}
          />
        )}

        <div
          className={cn(
            "container",
            hasGallery
              ? "relative z-10 -mt-14 space-y-8 sm:-mt-20 sm:space-y-10 md:-mt-24"
              : "space-y-8 pt-6 sm:space-y-10 sm:pt-8",
          )}
        >
          <CompanyInfoCard
            company={view}
            className={hasGallery ? "shadow-elegant" : undefined}
          />
          <CompanyStoreTabs
            company={view}
            productsMeta={productsMeta}
            paginationLabels={paginationLabels}
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
  );
}
