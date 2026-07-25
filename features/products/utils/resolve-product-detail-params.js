/**
 * Resolves product-detail query params (governorate filter for offering companies).
 *
 * @param {Record<string, string | string[] | undefined>} [searchParams]
 * @param {{ defaultGovernorateId?: string | number | null }} [options]
 */
export function resolveProductDetailParams(searchParams = {}, options = {}) {
  const read = (key) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const governorate =
    read("governorate") ?? options.defaultGovernorateId ?? null;

  return {
    governorate_id: governorate,
  };
}

/**
 * Builds a product detail href while preserving governorate filter.
 *
 * @param {string|number} slug
 * @param {{ governorate?: string|number|null }} [params]
 */
export function buildProductDetailHref(slug, { governorate } = {}) {
  const base = `/products/${encodeURIComponent(String(slug))}`;
  const query = new URLSearchParams();

  if (governorate != null && governorate !== "") {
    query.set("governorate", String(governorate));
  }

  const qs = query.toString();
  return qs ? `${base}?${qs}` : base;
}
