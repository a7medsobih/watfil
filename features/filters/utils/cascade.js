import { PRICE_MAX, PRICE_MIN } from "@/features/filters/constants";
import { isFiltersProductType } from "@/features/taxonomy";

/**
 * Applies a filter patch with taxonomy cascade clears.
 * Changing product type clears parent/category/stages.
 * Changing parent clears category.
 * Leaving Filters type clears stages.
 *
 * @param {object} current
 * @param {object} patch
 * @param {{ productTypes?: object[] }} [options]
 */
export function applyFilterCascade(current, patch, options = {}) {
  const next = { ...current, ...patch };
  const { productTypes = [] } = options;

  if ("product_type_id" in patch) {
    next.parent_category_id = null;
    next.category_id = null;
    next.number_of_stages = null;
  }

  if ("parent_category_id" in patch) {
    next.category_id = null;
  }

  const selectedType = productTypes.find(
    (type) => String(type.id) === String(next.product_type_id),
  );

  if (!isFiltersProductType(selectedType) && next.product_type_id) {
    next.number_of_stages = null;
  }

  if (!next.product_type_id) {
    next.number_of_stages = null;
  }

  return next;
}

/**
 * Unique sorted stage counts from taxonomy categories.
 *
 * @param {...object[]} categoryLists
 * @returns {number[]}
 */
export function collectStageOptions(...categoryLists) {
  const stages = new Set();

  for (const list of categoryLists) {
    for (const category of list ?? []) {
      if (category?.numberOfStages != null && category.numberOfStages > 0) {
        stages.add(Number(category.numberOfStages));
      }
    }
  }

  return Array.from(stages).sort((a, b) => a - b);
}

/**
 * Whether any browse filter (excluding page defaults) is active.
 *
 * @param {object} params
 */
export function hasActiveProductFilters(params = {}) {
  return Boolean(
    params.search ||
      params.product_type_id ||
      params.parent_category_id ||
      params.category_id ||
      params.number_of_stages ||
      params.governorate_id ||
      params.source ||
      (params.min_price != null &&
        params.min_price !== "" &&
        Number(params.min_price) > PRICE_MIN) ||
      (params.max_price != null &&
        params.max_price !== "" &&
        Number(params.max_price) < PRICE_MAX),
  );
}
