/**
 * Resolves companies list query from Next.js searchParams.
 * Extensible for search / page / per_page / filters.
 *
 * @param {Record<string, string | string[] | undefined>} [searchParams]
 * @param {{ defaultGovernorateId?: string | number | null }} [options]
 */
export function resolveCompaniesParams(searchParams = {}, options = {}) {
  const read = (key) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const governorate =
    read("governorate") ?? options.defaultGovernorateId ?? null;

  return {
    governorate_id: governorate,
    page: read("page") ?? 1,
    per_page: read("per_page") ?? 15,
    search: read("search"),
  };
}

/**
 * Builds a /companies href while preserving list query params.
 *
 * @param {object} params
 * @param {string|number} [params.governorate]
 * @param {string|number} [params.page]
 * @param {string|number} [params.per_page]
 * @param {string} [params.search]
 */
export function buildCompaniesHref({
  governorate,
  page,
  per_page,
  search,
} = {}) {
  const query = new URLSearchParams();

  if (governorate != null && governorate !== "") {
    query.set("governorate", String(governorate));
  }

  if (page != null && Number(page) > 1) {
    query.set("page", String(page));
  }

  if (per_page != null && Number(per_page) !== 15) {
    query.set("per_page", String(per_page));
  }

  if (search != null && search !== "") {
    query.set("search", String(search));
  }

  const qs = query.toString();
  return qs ? `/companies?${qs}` : "/companies";
}
