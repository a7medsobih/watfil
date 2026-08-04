/**
 * Unified like target types — matches POST/DELETE /customer/likes body.
 * SSOT: docs/WATAFL_CUSTOMER_LIKES_FRONTEND
 */
export const LIKE_TYPE = {
  COMPANY: "company",
  COMPANY_PRODUCT: "company_product",
  CATALOG_PRODUCT: "catalog_product",
};

/**
 * Product source in list payloads / GET likes filter (`?source=`).
 * Maps to LIKE_TYPE for mutations.
 */
export const LIKE_SOURCE = {
  CATALOG: "catalog",
  COMPANY: "company",
};

/**
 * @typedef {'company' | 'company_product' | 'catalog_product'} LikeType
 * @typedef {'catalog' | 'company'} LikeSource
 */

/**
 * Resolve API like type from UI context.
 * @param {{ type?: LikeType, source?: LikeSource, kind?: 'product'|'company' }} opts
 * @returns {LikeType}
 */
export function resolveLikeType({ type, source, kind } = {}) {
  if (
    type === LIKE_TYPE.COMPANY ||
    type === LIKE_TYPE.COMPANY_PRODUCT ||
    type === LIKE_TYPE.CATALOG_PRODUCT
  ) {
    return type;
  }

  if (kind === "company" || type === "company") {
    return LIKE_TYPE.COMPANY;
  }

  if (source === LIKE_SOURCE.COMPANY) {
    return LIKE_TYPE.COMPANY_PRODUCT;
  }

  return LIKE_TYPE.CATALOG_PRODUCT;
}

/**
 * Whether this like type updates the product likes store (vs company store).
 * @param {LikeType} type
 */
export function isProductLikeType(type) {
  return (
    type === LIKE_TYPE.COMPANY_PRODUCT || type === LIKE_TYPE.CATALOG_PRODUCT
  );
}

/**
 * Normalize an id fragment for like keys.
 * @param {string|number|null|undefined} value
 * @returns {string|null}
 */
function toKeyPart(value) {
  if (value == null || value === "") return null;
  return String(value);
}

/**
 * Stable client store key for a like target.
 *
 * Namespaces match the unified API types (separate backend tables):
 * - `company:{id}`
 * - `catalog_product:{id}`   → supplier_products.id
 * - `company_product:{id}`   → company_products.id
 *
 * Bare numeric ids must never be used — catalog and company products can share
 * the same integer id. `company_id` remains required on API mutations for
 * `company_product` (buildLikeBody / useLike) per the frontend likes guide.
 *
 * @param {{
 *   type?: LikeType,
 *   source?: LikeSource,
 *   kind?: 'product'|'company',
 *   id?: string|number|null,
 * }} opts
 * @returns {string|null}
 */
export function buildLikeKey({ type, source, kind, id } = {}) {
  const resolved = resolveLikeType({ type, source, kind });
  const idPart = toKeyPart(id);
  if (!idPart) return null;

  if (resolved === LIKE_TYPE.COMPANY) {
    return `${LIKE_TYPE.COMPANY}:${idPart}`;
  }

  if (resolved === LIKE_TYPE.COMPANY_PRODUCT) {
    return `${LIKE_TYPE.COMPANY_PRODUCT}:${idPart}`;
  }

  return `${LIKE_TYPE.CATALOG_PRODUCT}:${idPart}`;
}

/**
 * Build a product like key from a mapped wishlist / card product.
 * Uses `likeSource` / `source` from liked-product mapper.
 *
 * @param {{
 *   id?: string|number|null,
 *   likeSource?: LikeSource,
 *   source?: LikeSource,
 *   companyId?: string|number|null,
 * }|null|undefined} product
 * @returns {string|null}
 */
export function buildProductLikeKeyFromProduct(product) {
  if (!product || product.id == null || product.id === "") return null;

  const source =
    product.likeSource ??
    product.source ??
    (product.companyId != null ? LIKE_SOURCE.COMPANY : LIKE_SOURCE.CATALOG);

  return buildLikeKey({
    source,
    id: product.id,
  });
}
