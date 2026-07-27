import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeletonGrid } from "@/components/skeletons";

export default function Loading() {
  return (
    <section className="container pb-16 pt-10">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-52" />
      </div>
      <ProductCardSkeletonGrid
        count={4}
        className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      />
    </section>
  );
}
