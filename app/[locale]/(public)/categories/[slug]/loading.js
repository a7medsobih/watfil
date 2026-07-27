import { PageContentSkeleton } from "@/components/skeletons";
import { ProductCardSkeletonGrid } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContentSkeleton>
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <ProductCardSkeletonGrid
        count={8}
        className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      />
    </PageContentSkeleton>
  );
}
