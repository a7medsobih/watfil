/**
 * Resolves companies list query from Next.js searchParams.
 * governorate is optional — omit / empty / "all" means every governorate.
 *
 * @param {Record<string, string | string[] | undefined>} [searchParams]
 * @param {{ defaultGovernorateId?: string | number | null }} [options]
 */
export function resolveCompaniesParams(searchParams = {}, options = {}) {
  const read = (key) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const rawGovernorate = read("governorate");
  const hasExplicit =
    Object.prototype.hasOwnProperty.call(searchParams, "governorate");

  let governorate = null;
  if (hasExplicit) {
    if (
      rawGovernorate != null &&
      rawGovernorate !== "" &&
      rawGovernorate !== "all"
    ) {
      governorate = rawGovernorate;
    }
  } else if (options.defaultGovernorateId != null) {
    governorate = options.defaultGovernorateId;
  }

  return {
    governorate_id: governorate,
    page: read("page") ?? 1,
    per_page: read("per_page") ?? 15,
    search: read("search") || null,
  };
}

/**
 * Builds a /companies href while preserving list query params.
 *
 * @param {object} params
 * @param {string|number|null} [params.governorate]
 * @param {string|number|null} [params.governorate_id]
 * @param {string|number} [params.page]
 * @param {string|number} [params.per_page]
 * @param {string|null} [params.search]
 */
export function buildCompaniesHref({
  governorate,
  governorate_id,
  page,
  per_page,
  search,
} = {}) {
  const query = new URLSearchParams();
  const gov =
    governorate !== undefined ? governorate : governorate_id;

  if (gov != null && gov !== "" && gov !== "all") {
    query.set("governorate", String(gov));
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
