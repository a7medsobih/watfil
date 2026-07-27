import { Skeleton } from "@/components/ui/skeleton";
import { SearchResultsSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <section className="container pb-16 pt-10">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-11 w-full max-w-xl rounded-xl" />
      </div>
      <SearchResultsSkeleton count={6} />
    </section>
  );
}
