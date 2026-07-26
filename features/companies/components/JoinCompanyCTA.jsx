import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Reusable marketing CTA inviting companies to submit a join request.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} [props.actionLabel]
 * @param {string} [props.href="/join-us"]
 * @param {string} [props.className]
 */
export default function JoinCompanyCTA({
  title,
  description,
  actionLabel,
  href = "/join-us",
  className,
}) {
  return (
    <section className={cn("container py-10 md:py-14", className)}>
      <div className="relative overflow-hidden rounded-3xl border border-border/60 px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10"
        />

        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {description}
              </p>
            ) : null}
          </div>

          <Button
            variant="hero"
            size="lg"
            className="h-11 shrink-0 px-6"
            asChild
          >
            <Link href={href} className="group">
              {actionLabel}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                aria-hidden
              />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
