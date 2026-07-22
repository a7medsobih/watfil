const ARTICLE_IMAGE_PLACEHOLDER = "/images/blog-placeholder.webp";
const EXCERPT_MAX_LENGTH = 140;

function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createExcerptFromBody(body) {
  const text = stripHtml(body);

  if (!text) return "";

  if (text.length <= EXCERPT_MAX_LENGTH) {
    return text;
  }

  return `${text.slice(0, EXCERPT_MAX_LENGTH).trimEnd()}...`;
}

function mapCategory(category) {
  if (!category) return null;

  return {
    id: category.id,
    name: category.name ?? "",
  };
}

/**
 * Converts a backend article into the stable Article Model used by the UI.
 */
export function mapArticle(article) {
  if (!article) return null;

  const excerpt =
    article.excerpt != null && article.excerpt !== ""
      ? article.excerpt
      : createExcerptFromBody(article.body ?? "");

  return {
    id: article.id,
    slug: String(article.slug ?? article.id),
    title: article.title ?? "",
    excerpt,
    featuredImage:
      article.featured_image || article.featuredImage || ARTICLE_IMAGE_PLACEHOLDER,
    imageAlt: article.image_alt ?? article.imageAlt ?? article.title ?? "",
    publishedAt: article.published_at ?? article.publishedAt ?? null,
    viewsCount: Number(article.views_count ?? article.viewsCount ?? 0),
    category: mapCategory(article.category),
  };
}

export function mapArticles(articles = []) {
  return articles.map(mapArticle).filter(Boolean);
}

export function mapArticlesMeta(meta) {
  return {
    total: meta?.total ?? 0,
    currentPage: meta?.current_page ?? 1,
    lastPage: meta?.last_page ?? 1,
    perPage: meta?.per_page ?? 15,
  };
}
