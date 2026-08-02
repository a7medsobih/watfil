import { Skeleton } from "@/components/ui/skeleton";
import { CompanyCardSkeletonGrid } from "@/components/skeletons";
import { PRODUCTS_PER_PAGE } from "@/features/filters/constants";

export default function Loading() {
  return (
    <section className="container pb-16 pt-10">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-11 w-full max-w-md rounded-full" />
      </div>

      <div className="mb-8 flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-24 shrink-0 rounded-full" />
        ))}
      </div>

      <CompanyCardSkeletonGrid count={PRODUCTS_PER_PAGE} />
    </section>
  );
}
