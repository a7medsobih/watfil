import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pb-10 md:pb-16">
      <Skeleton className="h-[240px] w-full rounded-none sm:h-[340px] md:h-[420px]" />

      <div className="relative z-10 container -mt-12 sm:-mt-14 md:-mt-16">
        <div className="mx-auto max-w-2xl space-y-10 sm:space-y-12">
          <div className="mx-auto w-full max-w-sm rounded-2xl border border-border/60 bg-card px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <Skeleton className="size-14 rounded-xl sm:size-16" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>

          <div className="mx-auto max-w-xl space-y-4 px-1 text-center">
            <Skeleton className="mx-auto h-5 w-36" />
            <Skeleton className="mx-auto h-4 w-full" />
            <Skeleton className="mx-auto h-4 w-5/6" />
            <Skeleton className="mx-auto h-4 w-4/6" />
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md space-y-4 text-center">
              <Skeleton className="mx-auto h-6 w-24 rounded-full" />
              <Skeleton className="mx-auto h-8 w-64 max-w-full" />
              <Skeleton className="mx-auto h-4 w-72 max-w-full" />
              <div className="space-y-3 pt-3">
                <Skeleton className="h-14 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
