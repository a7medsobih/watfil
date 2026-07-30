"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";

import CompanyInfoCard from "@/features/companies/components/store/CompanyInfoCard";
import CompanyRatingsSection from "@/features/companies/components/store/CompanyRatingsSection";
import CompanyServicesSection from "@/features/companies/components/store/CompanyServicesSection";
import CompanyTeamSection from "@/features/companies/components/store/CompanyTeamSection";
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
 * Order: Hero → Info → Services → Store → Ratings → Team.
 * Campaign experience hides billboard ads only — gallery hero still shows when present.
 */
export default function CompanyStorePage({
  company,
  heroSlides = [],
  likeSlot = null,
  storeSlot = null,
}) {
  const locale = useLocale();
  const [personalization, setPersonalization] = useState({
    companyId: company?.id ?? null,
    myRating: undefined,
    isLiked: undefined,
    rating: undefined,
    reviews: undefined,
  });

  // Keep personalized fields across ISR shell refreshes until hydrator runs.
  if (company?.id !== personalization.companyId) {
    setPersonalization({
      companyId: company?.id ?? null,
      myRating: undefined,
      isLiked: undefined,
      rating: undefined,
      reviews: undefined,
    });
  }

  const applyPersonalization = useCallback((data) => {
    if (!data) return;
    setPersonalization((prev) => ({
      ...prev,
      ...(data.myRating !== undefined ? { myRating: data.myRating } : {}),
      ...(data.isLiked !== undefined ? { isLiked: data.isLiked } : {}),
    }));
  }, []);

  if (!company) return null;

  const view = {
    ...company,
    myRating:
      personalization.myRating !== undefined
        ? personalization.myRating
        : company.myRating,
    isLiked:
      personalization.isLiked !== undefined
        ? personalization.isLiked
        : company.isLiked,
    rating:
      personalization.rating !== undefined
        ? personalization.rating
        : company.rating,
    reviews:
      personalization.reviews !== undefined
        ? personalization.reviews
        : company.reviews,
  };

  const showHero = (heroSlides?.length ?? 0) > 0;
  const services = view.services ?? [];
  const team = view.team ?? [];

  return (
    <CompanyPersonalizationProvider onUpdate={applyPersonalization}>
      <div className="pb-16">
        <div className={cn(showHero && "relative")}>
          {showHero && (
            <CompanyHeroGallery slides={heroSlides} companyName={view.name} />
          )}

          <div
            className={cn(
              "container",
              showHero
                ? "relative z-10 -mt-14 space-y-8 sm:-mt-20 sm:space-y-10 md:-mt-24"
                : "space-y-8 pt-6 sm:space-y-10 sm:pt-8",
            )}
          >
            <CompanyInfoCard
              company={view}
              className={showHero ? "shadow-elegant" : undefined}
              likeSlot={likeSlot}
            />

            <CompanyServicesSection services={services} />

            {storeSlot}

            <CompanyRatingsSection
              companyId={view.id}
              ratings={view.ratings ?? []}
              myRating={view.myRating}
              averageRating={view.rating}
              ratingsCount={view.reviews ?? 0}
              viewsCount={view.viewsCount ?? 0}
              likesCount={view.likes ?? 0}
              locale={locale}
              onSummaryChange={(summary) => {
                setPersonalization((prev) => ({
                  ...prev,
                  myRating: summary.myRating,
                  rating: summary.rating,
                  reviews: summary.reviews,
                }));
              }}
            />

            <CompanyTeamSection team={team} />
          </div>
        </div>
      </div>
    </CompanyPersonalizationProvider>
  );
}
