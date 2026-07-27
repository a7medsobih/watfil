import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeletonGrid } from "@/components/skeletons/ProductCardSkeleton";
import { CompanyCardSkeletonGrid } from "@/components/skeletons/CompanyCardSkeleton";

/**
 * Home page loading shell — mirrors hero + categories + featured grid.
 */
export default function HomePageSkeleton() {
  return (
    <div aria-busy="true">
      <section className="container grid items-center gap-10 py-10 md:grid-cols-2 md:py-14 lg:gap-14">
        <div className="space-y-5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-12 w-full max-w-md sm:h-14" />
          <Skeleton className="h-12 w-4/5 max-w-sm sm:h-14" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-3/4 max-w-md" />
          <div className="flex flex-wrap gap-3 pt-2">
            <Skeleton className="h-11 w-36 rounded-full" />
            <Skeleton className="h-11 w-32 rounded-full" />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[520px]">
          <Skeleton className="aspect-square w-full rounded-[2.5rem]" />
          <div className="mt-5 flex justify-center gap-2">
            <Skeleton className="h-2 w-6 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>
        </div>
      </section>

      <section className="container py-10">
        <Skeleton className="mb-2 h-3 w-24" />
        <Skeleton className="mb-8 h-8 w-56" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
      </section>

      <section className="container py-10">
        <Skeleton className="mb-8 h-8 w-48" />
        <ProductCardSkeletonGrid
          count={4}
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        />
      </section>

      <section className="container py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-3xl" />
          ))}
        </div>
      </section>

      <section className="container py-10">
        <Skeleton className="mb-8 h-8 w-48" />
        <CompanyCardSkeletonGrid count={4} />
      </section>
    </div>
  );
}
