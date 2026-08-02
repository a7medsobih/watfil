/**
 * Product source for browsing / likes APIs.
 * @typedef {"company" | "catalog"} ProductSource
 */

export const PRODUCT_SOURCE = Object.freeze({
  COMPANY: "company",
  CATALOG: "catalog",
});

/**
 * @param {unknown} value
 * @returns {ProductSource}
 */
export function normalizeProductSource(value) {
  return value === PRODUCT_SOURCE.COMPANY
    ? PRODUCT_SOURCE.COMPANY
    : PRODUCT_SOURCE.CATALOG;
}
