import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import DownloadAppPromo from "@/components/common/DownloadAppPromo";
import {
  BlogCardSkeletonGrid,
  CompanyCardSkeletonGrid,
  ProductCardSkeletonGrid,
} from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import JoinCompanyCTA from "@/features/companies/components/JoinCompanyCTA";
import {
  BlogSection,
  CategoriesSection,
  CompaniesSection,
  HeroSection,
  ProductsSection,
  StatsSection,
  WhySection,
} from "@/features/home";

function SectionHeadingSkeleton({ className }) {
  return <Skeleton className={className ?? "mb-8 h-8 w-48"} />;
}

export default async function Page() {
  const t = await getTranslations("joinUs");

  return (
    <>
      <HeroSection />
      <CategoriesSection />

      <Suspense
        fallback={
          <section className="container py-10" aria-hidden>
            <SectionHeadingSkeleton />
            <ProductCardSkeletonGrid
              count={4}
              className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            />
          </section>
        }
      >
        <ProductsSection />
      </Suspense>

      <Suspense
        fallback={
          <section className="container py-12 md:py-16" aria-hidden>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-3xl" />
              ))}
            </div>
          </section>
        }
      >
        <StatsSection />
      </Suspense>

      <Suspense
        fallback={
          <section className="container py-12 md:py-16" aria-hidden>
            <SectionHeadingSkeleton />
            <CompanyCardSkeletonGrid count={4} />
          </section>
        }
      >
        <CompaniesSection />
      </Suspense>

      <WhySection />

      <Suspense
        fallback={
          <section className="container py-12 md:py-16" aria-hidden>
            <SectionHeadingSkeleton className="mb-8 h-8 w-40" />
            <BlogCardSkeletonGrid count={3} />
          </section>
        }
      >
        <BlogSection />
      </Suspense>

      <DownloadAppPromo placement="home" />
      <JoinCompanyCTA
        title={t("cta.home.title")}
        description={t("cta.home.description")}
        actionLabel={t("actions.joinNow")}
      />
    </>
  );
}
