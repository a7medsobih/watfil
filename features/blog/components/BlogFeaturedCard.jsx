import { ArrowRight, Clock, Eye } from "lucide-react";

import MediaImage from "@/components/common/MediaImage";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils/format-date";
import { cn } from "@/lib/utils";

/**
 * Featured article card — compact portrait media + reading-focused content.
 */
export default function BlogFeaturedCard({
  article,
  locale = "ar",
  readMoreLabel,
  readTimeLabel,
  className,
}) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/25 hover:shadow-card",
        className,
      )}
    >
      <Link
        href={`/blog/${article.slug}`}
        className="flex flex-col gap-4 p-3 sm:flex-row sm:gap-6 sm:p-4 md:p-5"
      >
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[180px] shrink-0 overflow-hidden rounded-xl bg-muted sm:mx-0 sm:w-[160px] md:w-[200px]">
          <MediaImage
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            kind="article"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center py-1 sm:py-2">
          <div className="flex flex-wrap items-center gap-2">
            {article.category && (
              <Badge
                variant="secondary"
                className="rounded-md px-2 py-0.5 text-[11px] font-medium"
              >
                {article.category.name}
              </Badge>
            )}

            <span className="text-xs text-muted-foreground">
              {formatDate(article.publishedAt, locale)}
            </span>
          </div>

          <h2 className="mt-3 text-xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-2xl md:text-[1.75rem]">
            {article.title}
          </h2>

          {article.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {article.excerpt}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {article.readingTimeMinutes > 0 && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readingTimeMinutes} {readTimeLabel}
              </span>
            )}

            {article.viewsCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {article.viewsCount}
              </span>
            )}

            <span className="inline-flex items-center gap-1 font-semibold text-primary sm:ms-auto">
              {readMoreLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
