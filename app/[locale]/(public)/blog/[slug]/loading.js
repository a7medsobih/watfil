import { PageContentSkeleton } from "@/components/skeletons";
import { BlogFeaturedCardSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <PageContentSkeleton>
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="aspect-[16/9] w-full rounded-3xl" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-3 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <BlogFeaturedCardSkeleton />
      </div>
    </PageContentSkeleton>
  );
}
