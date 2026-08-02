import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getArticle, getArticles } from "@/features/blog/api";
import { BlogArticlePage } from "@/features/blog/components";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/env";
import { buildMetadata } from "@/lib/seo/metadata";
import { resolveRedirect } from "@/lib/seo/resolve-redirect";

/** ISR: article details refresh every 5 minutes. */
export const revalidate = 300;

/** Uncached slugs still render on-demand (Vercel ISR). */
export const dynamicParams = true;

/**
 * Pre-render recent article slugs; remaining via on-demand ISR.
 */
export async function generateStaticParams() {
  try {
    const { articles } = await getArticles({ page: 1, per_page: 50 });
    return (articles || [])
      .map((article) => article.slug)
      .filter((slug) => slug != null && slug !== "")
      .map((slug) => ({ slug: String(slug) }));
  } catch (error) {
    console.warn("[blog/[slug] generateStaticParams] backend unavailable", {
      message: error?.message,
    });
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locale = await getLocale();

  try {
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
  } catch (error) {
    console.error(`[blog/[slug] generateMetadata] slug=${slug}`, error);
    return buildMetadata({
      title: "Article",
      path: `/blog/${slug}`,
      locale,
    });
  }
}

export default async function BlogArticleRoute({ params }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations();

  let article;
  try {
    article = await getArticle(slug);
  } catch (error) {
    console.error(`[blog/[slug] page] getArticle failed slug=${slug}`, {
      status: error?.status,
      code: error?.code,
      message: error?.message,
    });
    throw error;
  }

  if (!article) {
    const redirectPath = await resolveRedirect(`/blog/${slug}`);
    if (redirectPath) {
      const siteUrl = getSiteUrl();
      let target = String(redirectPath).trim();

      if (siteUrl && target.startsWith(siteUrl)) {
        target = target.slice(siteUrl.length);
      }

      if (!target.startsWith("/")) {
        target = `/${target}`;
      }

      for (const loc of routing.locales) {
        if (target === `/${loc}`) {
          target = "/";
          break;
        }
        if (target.startsWith(`/${loc}/`)) {
          target = target.slice(loc.length + 1);
          break;
        }
      }

      redirect({ href: target, locale });
    }
    notFound();
  }

  const incoming = decodeURIComponent(String(slug));
  if (incoming !== article.slug) {
    redirect({
      href: `/blog/${encodeURIComponent(article.slug)}`,
      locale,
    });
  }

  const relatedParams = {
    per_page: 4,
    page: 1,
    ...(article.category?.slug
      ? { category_slug: article.category.slug }
      : {}),
  };

  let relatedRaw = [];
  try {
    const result = await getArticles(relatedParams);
    relatedRaw = result.articles || [];
  } catch (error) {
    console.error(`[blog/[slug] page] related articles failed`, {
      message: error?.message,
    });
  }

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
