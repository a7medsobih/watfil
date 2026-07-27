import { Skeleton } from "@/components/ui/skeleton";
import PageContentSkeleton from "@/components/skeletons/PageContentSkeleton";

/**
 * Join-us / form-heavy page skeleton.
 */
export default function FormPageSkeleton() {
  return (
    <PageContentSkeleton>
      <div className="mx-auto max-w-2xl space-y-5 rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="mt-4 h-11 w-full rounded-full" />
      </div>
    </PageContentSkeleton>
  );
}
