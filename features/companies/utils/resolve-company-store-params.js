import {
  PRICE_MAX,
  PRICE_MIN,
  PRODUCTS_PER_PAGE,
} from "@/features/filters/constants";
import { EXPERIENCE } from "@/features/experience/constants";

export { PRICE_MIN, PRICE_MAX, PRICE_STEP } from "@/features/filters/constants";

const SOURCE_VALUES = ["catalog", "company"];

/**
 * Resolves company store products query from Next.js searchParams.
 * Backend filters only — no client-side filtering.
 * `experience` is UI-only and never sent to the products API.
 *
 * Param names match GET /public/companies/{id}/products (§2.9).
 *
 * @param {Record<string, string | string[] | undefined>} [searchParams]
 */
export function resolveCompanyStoreParams(searchParams = {}) {
  const read = (key) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const minPrice = read("min_price");
  const maxPrice = read("max_price");
  const sourceRaw = read("source");
  const source =
    sourceRaw && SOURCE_VALUES.includes(sourceRaw) ? sourceRaw : null;
  const experienceRaw = read("experience");
  const experience =
    experienceRaw === EXPERIENCE.CAMPAIGN ? EXPERIENCE.CAMPAIGN : null;

  return {
    page: Number(read("page")) > 0 ? Number(read("page")) : 1,
    per_page:
      Number(read("per_page")) > 0
        ? Number(read("per_page"))
        : PRODUCTS_PER_PAGE,
    search: read("search") || null,
    product_type_id: read("product_type_id") || null,
    parent_category_id: read("parent_category_id") || null,
    category_id: read("category_id") || null,
    number_of_stages: read("number_of_stages") || null,
    min_price: minPrice != null && minPrice !== "" ? Number(minPrice) : null,
    max_price: maxPrice != null && maxPrice !== "" ? Number(maxPrice) : null,
    source,
    experience,
  };
}

/**
 * Builds a /companies/{id} href from store filter state.
 * Omits defaults and empty values. Keeps parent_category_id for UI cascade.
 * Preserves `experience=campaign` for Campaign Experience navigation.
 *
 * @param {string|number} companyId
 * @param {object} [params]
 */
export function buildCompanyStoreHref(companyId, params = {}) {
  const base = `/companies/${encodeURIComponent(String(companyId))}`;
  const query = new URLSearchParams();

  if (params.search) query.set("search", String(params.search));
  if (params.product_type_id) {
    query.set("product_type_id", String(params.product_type_id));
  }
  if (params.parent_category_id) {
    query.set("parent_category_id", String(params.parent_category_id));
  }
  if (params.category_id) query.set("category_id", String(params.category_id));
  if (params.number_of_stages) {
    query.set("number_of_stages", String(params.number_of_stages));
  }

  if (
    params.min_price != null &&
    params.min_price !== "" &&
    Number(params.min_price) > PRICE_MIN
  ) {
    query.set("min_price", String(params.min_price));
  }

  if (
    params.max_price != null &&
    params.max_price !== "" &&
    Number(params.max_price) < PRICE_MAX
  ) {
    query.set("max_price", String(params.max_price));
  }

  if (params.source && SOURCE_VALUES.includes(String(params.source))) {
    query.set("source", String(params.source));
  }

  if (params.experience === EXPERIENCE.CAMPAIGN) {
    query.set("experience", EXPERIENCE.CAMPAIGN);
  }

  if (params.page != null && Number(params.page) > 1) {
    query.set("page", String(params.page));
  }

  if (
    params.per_page != null &&
    Number(params.per_page) !== PRODUCTS_PER_PAGE
  ) {
    query.set("per_page", String(params.per_page));
  }

  const qs = query.toString();
  return qs ? `${base}?${qs}` : base;
}

/**
 * Whether any company-store browse filter (excluding page / experience) is active.
 *
 * @param {object} params
 */
export function hasActiveCompanyStoreFilters(params = {}) {
  return Boolean(
    params.search ||
      params.product_type_id ||
      params.parent_category_id ||
      params.category_id ||
      params.number_of_stages ||
      params.source ||
      (params.min_price != null &&
        params.min_price !== "" &&
        Number(params.min_price) > PRICE_MIN) ||
      (params.max_price != null &&
        params.max_price !== "" &&
        Number(params.max_price) < PRICE_MAX),
  );
}
