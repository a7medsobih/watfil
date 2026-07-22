/**
 * Resolves list query from Next.js searchParams.
 * Extensible for search / category / tag / page / per_page.
 */
export function resolveArticlesParams(searchParams = {}) {
  const read = (key) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    page: read("page") ?? 1,
    per_page: read("per_page") ?? 15,
    search: read("search"),
    category: read("category"),
    tag: read("tag"),
  };
}
