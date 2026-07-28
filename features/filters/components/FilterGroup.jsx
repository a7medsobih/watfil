import { cn } from "@/lib/utils";

/**
 * Labeled section inside a filters sidebar / sheet.
 */
export function FilterGroup({ label, children, className }) {
  return (
    <div
      className={cn(
        "border-t border-border/60 pt-5 first:border-t-0 first:pt-0",
        className,
      )}
    >
      {label ? (
        <h3 className="mb-3 text-sm font-semibold text-foreground">{label}</h3>
      ) : null}
      {children}
    </div>
  );
}
