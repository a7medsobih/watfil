/**
 * Product like source — matches backend `?source=` filter.
 */
export const LIKE_SOURCE = {
  CATALOG: "catalog",
  COMPANY: "company",
};

/**
 * @typedef {'catalog' | 'company'} LikeSource
 */

/**
 * @typedef {object} ProductLikeTarget
 * @property {string|number} productId
 * @property {LikeSource} [source]
 * @property {string|number} [companyId] Required when source is `company`.
 */
