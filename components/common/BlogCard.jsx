import { ArrowRight, Clock, Eye } from "lucide-react";

import MediaImage from "@/components/common/MediaImage";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils/format-date";
import { cn } from "@/lib/utils";

export default function BlogCard({
    article,
    locale = "en",
    readMoreLabel,
    readTimeLabel,
    className = "",
}) {
    return (
        <article
            className={cn(
                "group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card",
                className,
            )}
        >
            <Link href={`/blog/${article.slug}`} className="flex h-full flex-col">
                <div className="relative aspect-[16/8] overflow-hidden bg-muted">
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

                <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>{formatDate(article.publishedAt, locale)}</span>

                        {article.readingTimeMinutes > 0 && readTimeLabel && (
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

                    <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug transition-colors group-hover:text-primary">
                        {article.title}
                    </h3>

                    {article.excerpt && (
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {article.excerpt}
                        </p>
                    )}

                    <div className="mt-auto pt-5">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                            {readMoreLabel}
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
