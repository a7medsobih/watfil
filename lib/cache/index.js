/**
 * Cache tags and revalidation intervals for Next.js fetch cache.
 *
 * Intervals:
 * - long (3600): categories, home stats, blog list
 * - medium (300): product / company details
 * - short (60): rapidly changing public lists
 */
export const cacheTags = {
  products: "products",
  companies: "companies",
  governorates: "governorates",
  categories: "categories",
  productTypes: "product-types",
  blog: "blog",
  statistics: "statistics",
};

export const revalidate = {
  short: 60,
  /** Product / company detail pages */
  medium: 300,
  /** Categories, home stats, blog list */
  long: 3600,
  blogFeatured: 3600,
  blogList: 3600,
};

/** Per-id tag for a catalog product detail. */
export function productTag(id) {
  return `product:${id}`;
}

/** Per-id tag for a company detail. */
export function companyTag(id) {
  return `company:${id}`;
}

/** Per-slug tag for a blog article. */
export function blogArticleTag(slug) {
  return `blog-article:${slug}`;
}
