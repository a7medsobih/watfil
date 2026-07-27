import { Skeleton } from "@/components/ui/skeleton";
import {
  BlogCardSkeletonGrid,
  BlogFeaturedCardSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <section className="container pb-16 pt-10">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="space-y-6">
        <BlogFeaturedCardSkeleton />
        <BlogCardSkeletonGrid count={4} />
      </div>
    </section>
  );
}
