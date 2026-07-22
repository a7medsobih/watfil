import { getLocale, getTranslations } from "next-intl/server";

import BlogCard from "@/components/common/BlogCard";
import PageHeader from "@/components/common/PageHeader";
import { getArticles } from "@/features/blog/api";
import { resolveArticlesParams } from "@/features/blog/utils/resolve-articles-params";

export default async function Page({ searchParams }) {
  const locale = await getLocale();
  const t = await getTranslations();
  const params = resolveArticlesParams(await searchParams);
  const { articles, meta } = await getArticles(params);
  void meta;

  return (
    <>
      <PageHeader
        title={t("blog.title")}
        subtitle={t("blog.subtitle")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.blog") },
        ]}
      />
      <section className="container pb-16 pt-2 sm:pt-4">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <BlogCard
              key={article.id}
              article={article}
              locale={locale}
              readMoreLabel={t("cta.readMore")}
            />
          ))}
        </div>
      </section>
    </>
  );
}
