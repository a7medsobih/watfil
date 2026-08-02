import { PRODUCTS_PER_PAGE } from "@/features/filters/constants";

/**
 * Resolves companies list query from Next.js searchParams.
 * governorate_id is optional — omit / empty / "all" means every governorate.
 * Matches GET /public/companies (§2.7) + page/per_page/search for list UX.
 *
 * @param {Record<string, string | string[] | undefined>} [searchParams]
 * @param {{ defaultGovernorateId?: string | number | null }} [options]
 */
export function resolveCompaniesParams(searchParams = {}, options = {}) {
  const read = (key) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const rawGovernorateId = read("governorate_id") ?? read("governorate");
  const hasExplicit =
    Object.prototype.hasOwnProperty.call(searchParams, "governorate_id") ||
    Object.prototype.hasOwnProperty.call(searchParams, "governorate");

  let governorate = null;
  if (hasExplicit) {
    if (
      rawGovernorateId != null &&
      rawGovernorateId !== "" &&
      rawGovernorateId !== "all"
    ) {
      governorate = rawGovernorateId;
    }
  } else if (options.defaultGovernorateId != null) {
    governorate = options.defaultGovernorateId;
  }

  return {
    governorate_id: governorate,
    page: Number(read("page")) > 0 ? Number(read("page")) : 1,
    per_page:
      Number(read("per_page")) > 0
        ? Number(read("per_page"))
        : PRODUCTS_PER_PAGE,
    search: read("search") || null,
  };
}

/**
 * Builds a /companies href while preserving list query params.
 * Always writes `governorate_id` (never the legacy `governorate` alias).
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
  const gov = governorate !== undefined ? governorate : governorate_id;

  if (gov != null && gov !== "" && gov !== "all") {
    query.set("governorate_id", String(gov));
  }

  if (page != null && Number(page) > 1) {
    query.set("page", String(page));
  }

  if (per_page != null && Number(per_page) !== PRODUCTS_PER_PAGE) {
    query.set("per_page", String(per_page));
  }

  if (search != null && search !== "") {
    query.set("search", String(search));
  }

  const qs = query.toString();
  return qs ? `/companies?${qs}` : "/companies";
}
