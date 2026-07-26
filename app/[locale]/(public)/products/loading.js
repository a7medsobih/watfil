import CardGridSkeleton from "@/components/common/CardGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="container pb-16 pt-10">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-64" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
        <Skeleton className="hidden h-[420px] rounded-3xl lg:block" />
        <CardGridSkeleton count={6} />
      </div>
    </section>
  );
}
