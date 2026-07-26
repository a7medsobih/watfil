import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Placeholder grid shown while a paginated list is being fetched.
 * Mirrors the real card proportions so the page does not shift on load.
 *
 * @param {object} props
 * @param {number} [props.count]
 * @param {string} [props.className] Grid columns.
 * @param {string} [props.mediaClassName] Card media aspect ratio.
 */
export default function CardGridSkeleton({
  count = 6,
  className = "sm:grid-cols-2 xl:grid-cols-3",
  mediaClassName = "aspect-square",
}) {
  return (
    <div className={cn("grid gap-5", className)} aria-hidden>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-border/60 bg-card"
        >
          <Skeleton className={cn("w-full rounded-none", mediaClassName)} />

          <div className="space-y-3 p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="mt-4 h-8 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
