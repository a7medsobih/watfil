export default function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 w-1/3 rounded bg-neutral-200" />
      <div className="h-4 w-2/3 rounded bg-neutral-200" />
      <div className="h-4 w-1/2 rounded bg-neutral-200" />
    </div>
  );
}
