import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="container pb-16 pt-10">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="overflow-hidden rounded-3xl border border-border/60">
        <div className="grid grid-cols-[minmax(7rem,10rem)_1fr_1fr] gap-px bg-border/40">
          {Array.from({ length: 6 }).map((_, row) => (
            <div key={row} className="contents">
              <div className="bg-card p-4">
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="bg-card p-4">
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="bg-card p-4">
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
