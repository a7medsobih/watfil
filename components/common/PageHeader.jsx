import AppBreadcrumb from "@/components/common/AppBreadcrumb";
import { cn } from "@/lib/utils";

/**
 * Unified page header for listing / content pages.
 * Keeps SectionHeader free for in-page home sections.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {{ label: string, href?: string }[]} [props.breadcrumbs]
 * @param {import("react").ReactNode} [props.actions]
 * @param {string} [props.className]
 */
export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}) {
  return (
    <header
      className={cn(
        "container pt-4 pb-6  md:pt-8 md:pb-10",
        className,
      )}
    >
      <div className="space-y-3 sm:space-y-4 md:space-y-5">
        {breadcrumbs?.length > 0 && <AppBreadcrumb items={breadcrumbs} />}

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0 max-w-2xl">
            <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-5xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3 md:text-base">
                {subtitle}
              </p>
            )}
          </div>

          {actions && <div className="w-full shrink-0 sm:w-auto">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
