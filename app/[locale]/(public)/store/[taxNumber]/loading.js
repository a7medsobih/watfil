import { PageContentSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContentSkeleton>
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <Skeleton className="mx-auto size-24 rounded-3xl" />
        <Skeleton className="mx-auto h-8 w-56" />
        <Skeleton className="mx-auto h-4 w-72 max-w-full" />
        <Skeleton className="mx-auto h-14 w-48 rounded-xl" />
        <Skeleton className="aspect-16/10 w-full rounded-2xl" />
      </div>
    </PageContentSkeleton>
  );
}
