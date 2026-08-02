import { Clock, Eye } from "lucide-react";

import AppBreadcrumb from "@/components/common/AppBreadcrumb";
import MediaImage from "@/components/common/MediaImage";
import JsonLd from "@/components/seo/JsonLd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils/format-date";
import { getSiteUrl } from "@/lib/env";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { routing } from "@/i18n/routing";

import BlogArticleContent from "./BlogArticleContent";
import BlogArticleSidebar, { BlogTags } from "./BlogArticleSidebar";
import BlogTableOfContents from "./BlogTableOfContents";
import BlogViewTracker from "./BlogViewTracker";

export default function BlogArticlePage({
  article,
  relatedArticles = [],
  locale = "ar",
  breadcrumbs = [],
  labels = {},
}) {
  const bodyHtml = article.body;
  const canonicalPath = `/blog/${article.slug}`;
  const siteUrl = getSiteUrl();
  const fullUrl =
    locale === routing.defaultLocale
      ? `${siteUrl}${canonicalPath}`
      : `${siteUrl}/${locale}${canonicalPath}`;

  const schemaBreadcrumbs = breadcrumbs.map((item) => ({
    name: item.label,
    url: item.href
      ? `${siteUrl}${locale === routing.defaultLocale ? "" : `/${locale}`}${item.href === "/" ? "" : item.href}`
      : fullUrl,
  }));

  return (
    <>
      <BlogViewTracker slug={article.slug} />

      <JsonLd
        data={breadcrumbSchema(schemaBreadcrumbs)}
      />
      <JsonLd
        data={articleSchema({
          title: article.title,
          description: article.metaDescription,
          url: fullUrl,
          image: article.featuredImage,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          authorName: article.author?.name,
        })}
      />

      <article className="container pb-16 pt-4 md:pt-8">
        <div className="mx-auto max-w-6xl">
          {breadcrumbs.length > 0 && (
            <AppBreadcrumb items={breadcrumbs} className="mb-6" />
          )}

          <header className="mx-auto max-w-3xl text-center">
            {article.category && (
              <p className="text-sm font-medium text-primary">
                {article.category.name}
              </p>
            )}

            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              {article.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {article.author && (
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    {article.author.avatar && (
                      <AvatarImage
                        src={article.author.avatar}
                        alt={article.author.name}
                      />
                    )}
                    <AvatarFallback>
                      {article.author.name?.charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">
                    {article.author.name}
                  </span>
                </div>
              )}

              {article.publishedAt && (
                <span>{formatDate(article.publishedAt, locale)}</span>
              )}

              {article.readingTimeMinutes > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readingTimeMinutes} {labels.readTime}
                </span>
              )}

              {article.viewsCount > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.viewsCount}
                </span>
              )}
            </div>
          </header>

          <div className="relative mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-sm">
            <MediaImage
              src={article.featuredImage}
              alt={article.imageAlt || article.title}
              kind="article"
              className="aspect-[2/1] w-full"
            />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              {article.headings.length > 0 && (
                <BlogTableOfContents
                  headings={article.headings}
                  title={labels.tableOfContents}
                  className="mb-8 lg:hidden"
                />
              )}

              <div className="mx-auto max-w-3xl">
                <BlogArticleContent
                  html={bodyHtml}
                  slug={article.slug}
                />

                <BlogTags
                  tags={article.tags}
                  label={labels.tags}
                  className="mt-10 border-t border-border/60 pt-8"
                />
              </div>
            </div>

            <div className="space-y-6">
              {article.headings.length > 0 && (
                <BlogTableOfContents
                  headings={article.headings}
                  title={labels.tableOfContents}
                  className="hidden lg:block"
                />
              )}

              <BlogArticleSidebar
                articles={relatedArticles}
                title={labels.relatedArticles}
                readTimeLabel={labels.readTime}
              />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
