/**
 * Resolves blog list query from Next.js searchParams.
 */
export function resolveArticlesParams(searchParams = {}) {
  const read = (key) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    page: read("page") ?? 1,
    per_page: read("per_page") ?? 12,
    search: read("search") || null,
    category_slug: read("category_slug") || null,
    tag_slug: read("tag_slug") || null,
  };
}

/**
 * Builds a /blog href from filter state.
 * @param {object} params
 */
export function buildBlogHref(params = {}) {
  const query = new URLSearchParams();

  if (params.search) query.set("search", String(params.search));
  if (params.category_slug) {
    query.set("category_slug", String(params.category_slug));
  }
  if (params.tag_slug) query.set("tag_slug", String(params.tag_slug));

  if (params.page != null && Number(params.page) > 1) {
    query.set("page", String(params.page));
  }

  if (params.per_page != null && Number(params.per_page) !== 12) {
    query.set("per_page", String(params.per_page));
  }

  const qs = query.toString();
  return qs ? `/blog?${qs}` : "/blog";
}
