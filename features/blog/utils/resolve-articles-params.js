/**
 * Resolves blog list query from Next.js searchParams.
 * Param names match GET /public/blog/articles (§9.1.2).
 */
export function resolveArticlesParams(searchParams = {}) {
  const read = (key) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const DEFAULT_PER_PAGE = 15;

  return {
    page: Number(read("page")) > 0 ? Number(read("page")) : 1,
    per_page:
      Number(read("per_page")) > 0
        ? Number(read("per_page"))
        : DEFAULT_PER_PAGE,
    search: read("search") || null,
    category_slug: read("category_slug") || null,
    tag_slug: read("tag_slug") || null,
    blog_category_id: read("blog_category_id") || null,
  };
}

/**
 * Builds a /blog href from filter state.
 * @param {object} params
 */
export function buildBlogHref(params = {}) {
  const query = new URLSearchParams();
  const DEFAULT_PER_PAGE = 15;

  if (params.search) query.set("search", String(params.search));
  if (params.category_slug) {
    query.set("category_slug", String(params.category_slug));
  }
  if (params.tag_slug) query.set("tag_slug", String(params.tag_slug));
  if (params.blog_category_id) {
    query.set("blog_category_id", String(params.blog_category_id));
  }

  if (params.page != null && Number(params.page) > 1) {
    query.set("page", String(params.page));
  }

  if (
    params.per_page != null &&
    Number(params.per_page) !== DEFAULT_PER_PAGE
  ) {
    query.set("per_page", String(params.per_page));
  }

  const qs = query.toString();
  return qs ? `/blog?${qs}` : "/blog";
}
