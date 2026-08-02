import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Matches `CompanyCard` layout: fixed h-44 media + padded body.
 */
export default function CompanyCardSkeleton({ className }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-border/60 bg-card",
        className,
      )}
      aria-hidden
    >
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="space-y-4 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of company card skeletons.
 */
export function CompanyCardSkeletonGrid({
  count = 8,
  className = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}) {
  return (
    <div className={cn("grid gap-5", className)} aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <CompanyCardSkeleton key={index} />
      ))}
    </div>
  );
}
