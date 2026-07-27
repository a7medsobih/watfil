import { ArrowRight, Clock, Eye } from "lucide-react";

import MediaImage from "@/components/common/MediaImage";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils/format-date";
import { cn } from "@/lib/utils";

/**
 * Hero-style featured article card for the blog listing.
 */
export default function BlogFeaturedCard({
  article,
  locale = "en",
  readMoreLabel,
  readTimeLabel,
  className,
}) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card",
        className,
      )}
    >
      <Link
        href={`/blog/${article.slug}`}
        className="grid gap-0 md:grid-cols-[1.1fr_1fr]"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-muted md:aspect-auto md:min-h-[280px]">
          <MediaImage
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            kind="article"
            className="transition-transform duration-500 group-hover:scale-105"
          />

          {article.category && (
            <Badge className="absolute start-4 top-4">
              {article.category.name}
            </Badge>
          )}
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{formatDate(article.publishedAt, locale)}</span>

            {article.readingTimeMinutes > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readingTimeMinutes} {readTimeLabel}
                </span>
              </>
            )}

            {article.viewsCount > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {article.viewsCount}
                </span>
              </>
            )}
          </div>

          <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-3xl md:text-4xl">
            {article.title}
          </h2>

          {article.excerpt && (
            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          )}

          <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            {readMoreLabel}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
