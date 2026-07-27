import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Generic public page shell: breadcrumb + title + content blocks.
 * Used when a route has no dedicated skeleton.
 */
export default function PageContentSkeleton({
  className,
  children,
  showActions = false,
}) {
  return (
    <section className={cn("container pb-16 pt-10", className)} aria-busy="true">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-40" />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56 sm:w-72" />
            <Skeleton className="h-4 w-64 max-w-full sm:w-96" />
          </div>
          {showActions ? <Skeleton className="h-11 w-48 rounded-full" /> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
