import {
  CompanyCardSkeletonGrid,
  ProductCardSkeletonGrid,
} from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Wishlist route loading UI — mirrors tabs + products grid to avoid CLS.
 */
export default function WishlistLoading() {
  return (
    <>
      <header className="container pt-4 pb-6 md:pt-8 md:pb-10">
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="min-w-0 max-w-2xl space-y-3">
            <Skeleton className="h-8 w-48 sm:h-10 md:h-12" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
        </div>
      </header>

      <section className="container space-y-6 pb-16 pt-2 sm:pt-4">
        <div
          className="flex h-auto flex-wrap gap-1.5 rounded-full bg-muted p-1.5"
          aria-hidden
        >
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>

        <ProductCardSkeletonGrid count={8} />

        <div className="sr-only" aria-hidden>
          <CompanyCardSkeletonGrid count={4} />
        </div>
      </section>
    </>
  );
}
