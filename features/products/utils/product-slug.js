/**
 * Builds a URL-safe product path segment.
 * Prefers `{sku}-{id}` so the numeric id remains resolvable.
 */
export function buildProductSlug(product) {
  if (!product || product.id == null || product.id === "") return "";

  const id = String(product.id);
  const sku = product.sku ? String(product.sku).trim() : "";

  if (sku) {
    const safeSku = sku
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/gi, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    return safeSku ? `${safeSku}-${id}` : id;
  }

  return id;
}

/**
 * Extracts the product id from a route param.
 * Supports `{sku}-{id}`, bare `{id}`, and legacy numeric paths.
 *
 * @param {string|number} param
 * @returns {string|null}
 */
export function resolveProductIdFromParam(param) {
  if (param == null || param === "") return null;

  const value = decodeURIComponent(String(param)).trim();
  if (!value) return null;

  if (/^\d+$/.test(value)) return value;

  const match = value.match(/-(\d+)$/);
  return match ? match[1] : null;
}
