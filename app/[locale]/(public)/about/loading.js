import { PageContentSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContentSkeleton>
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="mt-8 h-48 w-full rounded-3xl" />
      </div>
    </PageContentSkeleton>
  );
}
