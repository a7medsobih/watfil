import CardGridSkeleton from "@/components/common/CardGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="container pb-16 pt-10">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-64" />
      </div>

      <div className="mb-8 flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-24 shrink-0 rounded-full" />
        ))}
      </div>

      <CardGridSkeleton
        count={8}
        className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        mediaClassName="h-44"
      />
    </section>
  );
}
