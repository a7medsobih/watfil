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
                "group rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-primary/25 hover:shadow-card",
                className,
            )}
        >
            <Link
                href={`/blog/${article.slug}`}
                className="flex h-full gap-4 p-3 sm:gap-5 sm:p-4"
            >
                <div className="relative aspect-[3/4] w-[88px] shrink-0 overflow-hidden rounded-xl bg-muted sm:w-[104px]">
                    <MediaImage
                        src={article.featuredImage}
                        alt={article.imageAlt || article.title}
                        kind="article"
                        sizes="104px"
                        className="transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                <div className="flex min-w-0 flex-1 flex-col py-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                        {article.category && (
                            <Badge
                                variant="secondary"
                                className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                            >
                                {article.category.name}
                            </Badge>
                        )}

                        <span className="text-[11px] text-muted-foreground sm:text-xs">
                            {formatDate(article.publishedAt, locale)}
                        </span>
                    </div>

                    <h3 className="mt-2 line-clamp-2 text-[15px] font-bold leading-snug tracking-tight transition-colors group-hover:text-primary sm:text-base">
                        {article.title}
                    </h3>

                    {article.excerpt && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            {article.excerpt}
                        </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-[11px] text-muted-foreground sm:text-xs">
                        {article.readingTimeMinutes > 0 && readTimeLabel && (
                            <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.readingTimeMinutes} {readTimeLabel}
                            </span>
                        )}

                        {article.viewsCount > 0 && (
                            <span className="inline-flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {article.viewsCount}
                            </span>
                        )}

                        <span className="ms-auto inline-flex items-center gap-1 font-semibold text-primary">
                            {readMoreLabel}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}
