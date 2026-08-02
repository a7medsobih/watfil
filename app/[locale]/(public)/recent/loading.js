import { ProductCardSkeletonGrid } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentLoading() {
  return (
    <>
      <header className="container pt-4 pb-6 md:pt-8 md:pb-10">
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="min-w-0 max-w-2xl space-y-3">
            <Skeleton className="h-8 w-48 sm:h-10" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
        </div>
      </header>

      <section className="container space-y-12 pb-16 pt-2 sm:pt-4">
        <ProductCardSkeletonGrid count={8} />
        <ProductCardSkeletonGrid
          count={4}
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        />
      </section>
    </>
  );
}
