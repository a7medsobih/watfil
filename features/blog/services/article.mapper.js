import { IMAGE_PLACEHOLDERS } from "@/lib/media/placeholders";
import { addHeadingIds } from "@/features/blog/utils/article-content";
import { mapCategory } from "./category.mapper";

const ARTICLE_IMAGE_PLACEHOLDER = IMAGE_PLACEHOLDERS.article;
const EXCERPT_MAX_LENGTH = 140;
const WORDS_PER_MINUTE = 200;

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

function estimateReadingTime(body, providedMinutes) {
  const minutes = Number(providedMinutes);
  if (minutes > 0) return minutes;

  const words = stripHtml(body).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function mapAuthor(author) {
  if (!author) return null;

  return {
    id: author.id,
    name: author.name ?? "",
    avatar: author.avatar ?? author.image ?? null,
    bio: author.bio ?? "",
  };
}

function mapTag(tag) {
  if (!tag) return null;

  return {
    id: tag.id,
    name: tag.name ?? "",
    slug: String(tag.slug ?? tag.id),
  };
}

function mapTags(tags = []) {
  return tags.map(mapTag).filter(Boolean);
}

/**
 * Extracts h2/h3 headings from HTML for table of contents.
 * @param {string} body
 */
export function extractHeadings(body = "") {
  const headings = [];
  const regex = /<h([2-3])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h\1>/gi;
  let match;

  while ((match = regex.exec(body)) !== null) {
    const level = Number(match[1]);
    const id = match[2] || `heading-${headings.length + 1}`;
    const text = stripHtml(match[3]);

    if (text) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}

/**
 * Converts a backend article into the stable Article Model used by list UI.
 */
export function mapArticle(article) {
  if (!article) return null;

  const body = article.body ?? "";
  const excerpt =
    article.excerpt != null && article.excerpt !== ""
      ? article.excerpt
      : createExcerptFromBody(body);

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
    readingTimeMinutes: estimateReadingTime(
      body,
      article.reading_time ?? article.readingTime ?? article.reading_time_minutes,
    ),
    category: mapCategory(article.category ?? article.blog_category),
    tags: mapTags(article.tags ?? []),
  };
}

/**
 * Full article model for the detail page.
 */
export function mapArticleDetail(article) {
  if (!article) return null;

  const rawBody = article.body ?? "";
  const body = addHeadingIds(rawBody);
  const base = mapArticle({ ...article, body: rawBody });

  return {
    ...base,
    body,
    updatedAt: article.updated_at ?? article.updatedAt ?? null,
    metaTitle: article.meta_title ?? article.metaTitle ?? base.title,
    metaDescription:
      article.meta_description ?? article.metaDescription ?? base.excerpt,
    author: mapAuthor(article.author),
    headings: extractHeadings(body),
    canonicalPath: `/blog/${base.slug}`,
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
