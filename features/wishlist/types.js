/**
 * Unified like target types — matches POST/DELETE /customer/likes body.
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
