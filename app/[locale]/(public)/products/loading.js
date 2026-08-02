import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeletonGrid } from "@/components/skeletons";
import { PRODUCTS_PER_PAGE } from "@/features/filters/constants";

export default function Loading() {
  return (
    <section className="container pb-16 pt-10">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-11 w-full max-w-md rounded-full" />
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
        <Skeleton className="hidden h-[420px] rounded-3xl lg:block" />
        <div>
          <div className="mb-5 hidden lg:block">
            <Skeleton className="h-4 w-32" />
          </div>
          <ProductCardSkeletonGrid
            count={PRODUCTS_PER_PAGE}
            className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
          />
        </div>
      </div>
    </section>
  );
}
