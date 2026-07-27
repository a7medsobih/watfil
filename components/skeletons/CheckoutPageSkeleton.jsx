import { Skeleton } from "@/components/ui/skeleton";
import PageContentSkeleton from "@/components/skeletons/PageContentSkeleton";

/**
 * Checkout form page skeleton.
 */
export default function CheckoutPageSkeleton() {
  return (
    <PageContentSkeleton>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5 rounded-3xl border border-border/60 bg-card p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <div className="space-y-4 rounded-3xl border border-border/60 bg-card p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    </PageContentSkeleton>
  );
}
