import { getLocale, getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { getArticle, getArticles } from "@/features/blog/api";
import { BlogArticlePage } from "@/features/blog/components";
import { buildMetadata } from "@/lib/seo/metadata";
import { resolveRedirect } from "@/lib/seo/resolve-redirect";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locale = await getLocale();
  const article = await getArticle(slug);

  if (!article) {
    return buildMetadata({
      title: "Article",
      path: `/blog/${slug}`,
      locale,
    });
  }

  return buildMetadata({
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    path: article.canonicalPath,
    locale,
    type: "article",
    images: article.featuredImage
      ? [{ url: article.featuredImage }]
      : undefined,
  });
}

export default async function BlogArticleRoute({ params }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations();

  const article = await getArticle(slug);

  if (!article) {
    const redirectPath = await resolveRedirect(`/blog/${slug}`);
    if (redirectPath) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
      let target = String(redirectPath).trim();

      if (siteUrl && target.startsWith(siteUrl)) {
        target = target.slice(siteUrl.length);
      }

      if (!target.startsWith("/")) {
        target = `/${target}`;
      }

      if (!target.startsWith(`/${locale}`)) {
        target = `/${locale}${target}`;
      }

      redirect(target);
    }
    notFound();
  }

  const incoming = decodeURIComponent(String(slug));
  if (incoming !== article.slug) {
    redirect(`/${locale}/blog/${encodeURIComponent(article.slug)}`);
  }

  const relatedParams = {
    per_page: 4,
    page: 1,
    ...(article.category?.slug
      ? { category_slug: article.category.slug }
      : {}),
  };

  const { articles: relatedRaw } = await getArticles(relatedParams);
  const relatedArticles = relatedRaw
    .filter((item) => item.id !== article.id)
    .slice(0, 3);

  const breadcrumbs = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.blog"), href: "/blog" },
  ];

  if (article.category?.slug) {
    breadcrumbs.push({
      label: article.category.name,
      href: `/blog?category_slug=${encodeURIComponent(article.category.slug)}`,
    });
  }

  breadcrumbs.push({ label: article.title });

  return (
    <BlogArticlePage
      article={article}
      relatedArticles={relatedArticles}
      locale={locale}
      breadcrumbs={breadcrumbs}
      labels={{
        readTime: t("blog.readTime"),
        tableOfContents: t("blog.tableOfContents"),
        relatedArticles: t("blog.relatedArticles"),
        tags: t("blog.tags"),
        readMore: t("cta.readMore"),
      }}
    />
  );
}
