import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeletonGrid } from "@/components/skeletons";

export default function Loading() {
  return (
    <section className="container pb-16 pt-10">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="mb-8 flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-28 rounded-2xl" />
        ))}
      </div>
      <ProductCardSkeletonGrid count={8} className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" />
    </section>
  );
}
