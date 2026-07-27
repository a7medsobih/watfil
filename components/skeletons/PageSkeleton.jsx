import PageContentSkeleton from "./PageContentSkeleton";

/** @deprecated Prefer PageContentSkeleton for layout-matched loading UX. */
export default function PageSkeleton() {
  return (
    <PageContentSkeleton>
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-3xl bg-muted" />
        <div className="h-40 animate-pulse rounded-3xl bg-muted" />
      </div>
    </PageContentSkeleton>
  );
}
