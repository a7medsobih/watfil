/** Default catalog price slider bounds (EGP). */
export const PRICE_MIN = 0;
export const PRICE_MAX = 8000;
export const PRICE_STEP = 100;

/**
 * Default page size for public products list.
 * Matches backend pagination default (`per_page` = 15).
 */
export const PRODUCTS_PER_PAGE = 15;

/**
 * Common stage counts when taxonomy does not expose stage options yet.
 * @type {readonly number[]}
 */
export const DEFAULT_FILTER_STAGES = Object.freeze([5, 6, 7]);
