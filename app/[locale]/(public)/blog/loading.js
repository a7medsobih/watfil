import { Skeleton } from "@/components/ui/skeleton";
import {
  BlogCardSkeletonGrid,
  BlogFeaturedCardSkeleton,
} from "@/components/skeletons";

/** Matches blog list default `per_page` (15) with featured + remaining cards. */
const BLOG_PER_PAGE = 15;

export default function Loading() {
  return (
    <section className="container pb-16 pt-10">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-11 w-full max-w-md rounded-full" />
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="space-y-6">
        <BlogFeaturedCardSkeleton />
        <BlogCardSkeletonGrid count={Math.max(BLOG_PER_PAGE - 1, 4)} />
      </div>
    </section>
  );
}
