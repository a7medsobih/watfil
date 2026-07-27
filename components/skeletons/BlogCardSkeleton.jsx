import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Matches `BlogCard` layout: portrait thumb (aspect 3/4, ~88–104px) + content.
 */
export default function BlogCardSkeleton({ className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-card",
        className,
      )}
      aria-hidden
    >
      <div className="flex h-full gap-4 p-3 sm:gap-5 sm:p-4">
        <Skeleton className="aspect-[3/4] w-[88px] shrink-0 rounded-xl sm:w-[104px]" />
        <div className="flex min-w-0 flex-1 flex-col py-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-4/5" />
          <Skeleton className="mt-1.5 h-3 w-full" />
          <Skeleton className="mt-1 h-3 w-3/5" />
          <div className="mt-auto flex items-center gap-3 pt-3">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="ms-auto h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Featured blog card skeleton (larger portrait + horizontal layout).
 */
export function BlogFeaturedCardSkeleton({ className }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/50 bg-card",
        className,
      )}
      aria-hidden
    >
      <div className="flex flex-col gap-4 p-3 sm:flex-row sm:gap-6 sm:p-4 md:p-5">
        <Skeleton className="mx-auto aspect-[3/4] w-full max-w-[180px] shrink-0 rounded-xl sm:mx-0 sm:w-[160px] md:w-[200px]" />
        <div className="flex min-w-0 flex-1 flex-col justify-center py-1 sm:py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="mt-3 h-7 w-full sm:h-8" />
          <Skeleton className="mt-2 h-7 w-4/5 sm:h-8" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-2/3" />
          <div className="mt-5 flex flex-wrap gap-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-20 sm:ms-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of blog card skeletons.
 */
export function BlogCardSkeletonGrid({
  count = 4,
  className = "grid-cols-1 md:grid-cols-2",
}) {
  return (
    <div className={cn("grid gap-4", className)} aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}
