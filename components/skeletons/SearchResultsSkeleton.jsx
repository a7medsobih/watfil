import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeletonGrid } from "@/components/skeletons/ProductCardSkeleton";
import { cn } from "@/lib/utils";

/**
 * Search results placeholder — product-first grid with optional tabs row.
 */
export default function SearchResultsSkeleton({
  count = 6,
  className,
}) {
  return (
    <div className={cn("space-y-6", className)} aria-busy="true">
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
      <ProductCardSkeletonGrid count={count} />
    </div>
  );
}
