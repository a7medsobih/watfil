import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Generic empty state for list pages.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {import("react").ReactNode} [props.icon]
 * @param {import("react").ReactNode} [props.action]
 * @param {string} [props.className]
 */
export default function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60  px-6 py-14 text-center shadow-soft sm:px-10 sm:py-16",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 "
      />

      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <div className="mb-5 grid size-16 place-items-center rounded-2xl gradient-water text-primary shadow-soft sm:size-[4.5rem]">
          {icon ?? <Building2 className="size-7 sm:size-8" aria-hidden />}
        </div>

        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}

        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}
