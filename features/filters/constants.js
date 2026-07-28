/** Default catalog price slider bounds (EGP). */
export const PRICE_MIN = 0;
export const PRICE_MAX = 8000;
export const PRICE_STEP = 100;

/** Default page size for public products list. */
export const PRODUCTS_PER_PAGE = 15;

/**
 * Sort options wired to GET /public/products?sort=
 * @type {readonly string[]}
 */
export const PRODUCT_SORT_VALUES = Object.freeze([
  "newest",
  "price_asc",
  "price_desc",
  "popular",
]);

export const DEFAULT_PRODUCT_SORT = "newest";

/**
 * Common stage counts when taxonomy does not expose stage options yet.
 * @type {readonly number[]}
 */
export const DEFAULT_FILTER_STAGES = Object.freeze([5, 6, 7]);
