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
  { source = "catalog" } = {},
) {
  const base = `/companies/${encodeURIComponent(String(companySlug))}/products/${encodeURIComponent(String(productId))}`;
  const query = new URLSearchParams();

  if (source) query.set("source", String(source));

  const qs = query.toString();
  return qs ? `${base}?${qs}` : base;
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
