import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Matches `ProductCard` layout: square media + padded body.
 * Prevents layout shift while product grids load.
 */
export default function ProductCardSkeleton({ className }) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card",
        className,
      )}
      aria-hidden
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="mt-auto h-8 w-1/2" />
      </div>
    </div>
  );
}

/**
 * Grid of product card skeletons.
 */
export function ProductCardSkeletonGrid({
  count = 6,
  className = "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
}) {
  return (
    <div className={cn("grid gap-5", className)} aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
