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
 * Product detail href from a product id.
 *
 * @param {string|number} productId
 * @param {{ governorate?: string|number|null }} [params]
 */
export function buildProductDetailHref(productId, { governorate } = {}) {
  if (productId == null || productId === "") return null;

  const base = `/products/${encodeURIComponent(String(productId))}`;
  const query = new URLSearchParams();

  if (governorate != null && governorate !== "") {
    query.set("governorate", String(governorate));
  }

  const qs = query.toString();
  return qs ? `${base}?${qs}` : base;
}

/**
 * Catalog product URLs — temporary: path uses numeric id (API contract).
 *
 * @param {object|string|number|null|undefined} productOrId
 * @param {{ governorate?: string|number|null }} [params]
 * @returns {string|null}
 */
export function buildCatalogProductHref(productOrId, { governorate } = {}) {
  if (productOrId == null || productOrId === "") return null;

  let productId = null;

  if (typeof productOrId === "string" || typeof productOrId === "number") {
    productId = String(productOrId);
  } else {
    productId = productOrId.id != null ? String(productOrId.id) : null;
  }

  if (!productId) return null;

  return buildProductDetailHref(productId, { governorate });
}
