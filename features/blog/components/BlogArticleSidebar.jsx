import MediaImage from "@/components/common/MediaImage";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { buildBlogHref } from "@/features/blog/utils/resolve-articles-params";
import { cn } from "@/lib/utils";

/**
 * Sidebar with related / latest articles.
 */
export default function BlogArticleSidebar({
  articles = [],
  title,
  readTimeLabel,
  className,
}) {
  if (!articles.length) return null;

  return (
    <aside className={cn("space-y-5", className)}>
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>

      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="group flex gap-3 rounded-2xl border border-border/60 bg-card p-3 transition-colors hover:border-primary/20"
          >
            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
              <MediaImage
                src={article.featuredImage}
                alt=""
                kind="article"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                {article.title}
              </p>
              {article.readingTimeMinutes > 0 && readTimeLabel && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {article.readingTimeMinutes} {readTimeLabel}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

/**
 * Tag list below article content.
 */
export function BlogTags({ tags = [], label, className }) {
  if (!tags.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {label && (
        <span className="text-sm font-medium text-muted-foreground">
          {label}:
        </span>
      )}

      {tags.map((tag) => (
        <Badge key={tag.id} variant="secondary" asChild>
          <Link href={buildBlogHref({ tag_slug: tag.slug })}>
            {tag.name}
          </Link>
        </Badge>
      ))}
    </div>
  );
}
