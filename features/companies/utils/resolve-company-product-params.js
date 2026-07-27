/**
 * Builds a company product-details href.
 * GET /public/companies/{id}/product-details?source=&product_id=
 *
 * @param {string} companySlug
 * @param {string|number} productId
 * @param {{ source?: string }} [options]
 */
export function buildCompanyProductHref(
  companySlug,
  productId,
  { source = "catalog", governorate } = {},
) {
  const base = `/companies/${encodeURIComponent(String(companySlug))}/products/${encodeURIComponent(String(productId))}`;
  const query = new URLSearchParams();

  if (source) query.set("source", String(source));
  if (governorate != null && governorate !== "") {
    query.set("governorate", String(governorate));
  }

  const qs = query.toString();
  return qs ? `${base}?${qs}` : base;
}

/**
 * Resolves governorate query for company product pages.
 *
 * @param {Record<string, string | string[] | undefined>} [searchParams]
 * @param {{ defaultGovernorateId?: string | number | null }} [options]
 */
export function resolveCompanyProductGovernorate(
  searchParams = {},
  options = {},
) {
  const value = searchParams?.governorate;
  const raw = Array.isArray(value) ? value[0] : value;

  if (raw != null && raw !== "") return raw;

  return options.defaultGovernorateId ?? null;
}

/**
 * Resolves `source` query for company product-details pages.
 *
 * @param {Record<string, string | string[] | undefined>} [searchParams]
 * @returns {"catalog"|"company"}
 */
export function resolveCompanyProductSource(searchParams = {}) {
  const value = searchParams?.source;
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "company" ? "company" : "catalog";
}
