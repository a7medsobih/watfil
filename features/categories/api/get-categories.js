import { getTaxonomyCategories } from "@/features/taxonomy/api";

/**
 * Backwards-compatible categories list.
 * Prefer taxonomy helpers when cascading by product type / parent.
 *
 * @param {object} [params]
 * @param {{ locale?: string }} [options]
 * @returns {Promise<object[]>}
 */
export async function getCategories(params = {}, options = {}) {
  return getTaxonomyCategories(params, options);
}
