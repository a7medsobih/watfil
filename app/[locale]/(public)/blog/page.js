import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { FileText } from "lucide-react";

import AppPagination from "@/components/common/AppPagination";
import BlogCard from "@/components/common/BlogCard";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  getArticles,
  getBlogCategories,
} from "@/features/blog/api";
import {
  BlogCategoriesNav,
  BlogFeaturedCard,
  BlogSearch,
} from "@/features/blog/components";
import { groupCategoriesByParent } from "@/features/blog/services/category.mapper";
import {
  buildBlogHref,
  resolveArticlesParams,
} from "@/features/blog/utils/resolve-articles-params";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ searchParams }) {
  const locale = await getLocale();
  const t = await getTranslations();
  const params = resolveArticlesParams(await searchParams);

  let title = t("blog.title");
  let path = "/blog";

  if (params.category_slug) {
    const categories = await getBlogCategories();
    const category = categories.find((c) => c.slug === params.category_slug);
    if (category) {
      title = category.name;
      path = buildBlogHref({ category_slug: params.category_slug });
    }
  }

  if (params.search) {
    title = t("blog.searchResults", { query: params.search });
  }

  return buildMetadata({
    title,
    description: t("blog.subtitle"),
    path,
    locale,
  });
}

export default async function Page({ searchParams }) {
  const locale = await getLocale();
  const t = await getTranslations();
  const params = resolveArticlesParams(await searchParams);

  const [categories, { articles, meta }] = await Promise.all([
    getBlogCategories(),
    getArticles(params),
  ]);

  const { roots, childrenMap } = groupCategoriesByParent(categories);

  const activeCategory = params.category_slug
    ? categories.find((c) => c.slug === params.category_slug)
    : null;

  const displayCategories = roots.length > 0 ? roots : categories;

  const subCategories = (() => {
    if (!activeCategory) return [];

    if (activeCategory.parentId) {
      return childrenMap.get(String(activeCategory.parentId)) ?? [];
    }

    return childrenMap.get(String(activeCategory.id)) ?? [];
  })();

  const hasActiveFilters = Boolean(params.search || params.category_slug);
  const showFeatured =
    Number(params.page) <= 1 &&
    !params.search &&
    articles.length > 0;

  const featuredArticle = showFeatured ? articles[0] : null;
  const gridArticles = showFeatured ? articles.slice(1) : articles;

  const breadcrumbs = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.blog"), href: hasActiveFilters ? "/blog" : undefined },
  ];

  if (activeCategory) {
    breadcrumbs.push({ label: activeCategory.name });
  } else if (params.search) {
    breadcrumbs.push({
      label: t("blog.searchResults", { query: params.search }),
    });
  }

  const pageTitle = activeCategory?.name ?? t("blog.title");
  const pageSubtitle = activeCategory?.description || t("blog.subtitle");

  return (
    <>
      <PageHeader
        title={pageTitle}
        subtitle={pageSubtitle}
        breadcrumbs={breadcrumbs}
        actions={
          <Suspense fallback={null}>
            <BlogSearch placeholder={t("blog.searchPlaceholder")} />
          </Suspense>
        }
      />

      <section className="container pb-16 pt-2 sm:pt-4">
        <Suspense fallback={null}>
          <BlogCategoriesNav
            categories={displayCategories}
            subCategories={subCategories}
            activeSlug={params.category_slug}
            search={params.search}
            allLabel={t("blog.allCategories")}
            className="mb-8"
          />
        </Suspense>

        {subCategories.length > 0 && activeCategory && (
          <p className="mb-6 text-sm text-muted-foreground">
            {t("blog.inCategory", { category: activeCategory.name })}
          </p>
        )}

        <p className="mb-6 text-sm text-muted-foreground">
          {t("blog.count", { count: meta.total })}
        </p>

        {articles.length > 0 ? (
          <div className="space-y-6">
            {featuredArticle && (
              <BlogFeaturedCard
                article={featuredArticle}
                locale={locale}
                readMoreLabel={t("cta.readMore")}
                readTimeLabel={t("blog.readTime")}
              />
            )}

            {gridArticles.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {gridArticles.map((article) => (
                  <BlogCard
                    key={article.id}
                    article={article}
                    locale={locale}
                    readMoreLabel={t("cta.readMore")}
                    readTimeLabel={t("blog.readTime")}
                  />
                ))}
              </div>
            )}

            <AppPagination
              currentPage={meta.currentPage}
              lastPage={meta.lastPage}
              total={meta.total}
              perPage={meta.perPage}
              labels={{
                previous: t("pagination.previous"),
                next: t("pagination.next"),
              }}
              hrefBuilder={(page) =>
                buildBlogHref({
                  search: params.search,
                  category_slug: params.category_slug,
                  tag_slug: params.tag_slug,
                  page,
                  per_page: params.per_page,
                })
              }
            />
          </div>
        ) : (
          <EmptyState
            icon={<FileText className="size-7 sm:size-8" aria-hidden />}
            title={t("blog.emptyTitle")}
            description={t("blog.empty")}
            action={
              hasActiveFilters ? (
                <Button variant="outline" asChild>
                  <Link href="/blog">{t("blog.viewAll")}</Link>
                </Button>
              ) : null
            }
          />
        )}
      </section>
    </>
  );
}
