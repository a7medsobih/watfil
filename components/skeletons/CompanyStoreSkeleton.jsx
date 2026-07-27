import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeletonGrid } from "@/components/skeletons/ProductCardSkeleton";

/**
 * Matches CompanyStorePage: gallery + overlapping info card + product grid.
 */
export default function CompanyStoreSkeleton() {
  return (
    <div className="pb-16" aria-busy="true">
      <div className="relative">
        <Skeleton className="h-[240px] w-full rounded-none sm:h-[340px] md:h-[440px] lg:h-[500px]" />

        <div className="container relative z-10 -mt-14 space-y-8 sm:-mt-20 sm:space-y-10 md:-mt-24">
          <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft sm:p-6 md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              <Skeleton className="mx-auto size-20 shrink-0 rounded-2xl sm:mx-0 sm:size-24" />
              <div className="min-w-0 flex-1 space-y-4 text-center sm:text-start">
                <Skeleton className="mx-auto h-8 w-48 sm:mx-0 sm:w-64" />
                <Skeleton className="mx-auto h-4 w-32 sm:mx-0" />
                <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="mx-auto size-10 shrink-0 rounded-full sm:mx-0" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
            <ProductCardSkeletonGrid
              count={8}
              className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
