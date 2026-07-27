import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeletonGrid } from "@/components/skeletons/ProductCardSkeleton";

/**
 * Matches ProductDetailsPage / company offer detail layout.
 */
export default function ProductDetailSkeleton() {
  return (
    <div className="container pb-16 pt-4 md:pt-8" aria-busy="true">
      <div className="mb-6 md:mb-8">
        <Skeleton className="h-4 w-56" />
      </div>

      <div className="grid items-start gap-6 md:gap-8 lg:grid-cols-[minmax(0,18rem)_1fr] xl:grid-cols-[minmax(0,20rem)_1fr]">
        <div className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <Skeleton className="aspect-4/3 w-full rounded-2xl sm:rounded-3xl" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-4/5 max-w-lg" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-3/4 max-w-md" />
          <div className="flex flex-wrap gap-3 pt-2">
            <Skeleton className="size-10 rounded-md" />
            <Skeleton className="h-4 w-16 self-center" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
          <Skeleton className="mt-4 h-12 w-40 rounded-full" />
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>

      <div className="mt-12 sm:mt-16">
        <Skeleton className="mb-6 h-8 w-48 md:mb-8 md:w-64" />
        <ProductCardSkeletonGrid
          count={4}
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        />
      </div>
    </div>
  );
}
