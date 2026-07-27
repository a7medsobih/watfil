import { PageContentSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContentSkeleton>
      <div className="mx-auto max-w-3xl space-y-4 rounded-3xl border border-border/60 bg-card p-8">
        <Skeleton className="mx-auto size-16 rounded-full" />
        <Skeleton className="mx-auto h-7 w-48" />
        <Skeleton className="mx-auto h-4 w-72 max-w-full" />
        <Skeleton className="mt-6 h-24 w-full rounded-2xl" />
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </PageContentSkeleton>
  );
}
