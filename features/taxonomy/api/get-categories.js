import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { mapTaxonomyCategories } from "@/features/taxonomy/services";

/**
 * Builds query for GET /public/categories.
 * Omit parent_category_id for roots (with optional product_type_id).
 *
 * @param {object} [params]
 */
function buildCategoriesQuery(params = {}) {
  const query = {};

  if (params.product_type_id != null && params.product_type_id !== "") {
    query.product_type_id = params.product_type_id;
  }

  if (
    params.parent_category_id != null &&
    params.parent_category_id !== "" &&
    params.parent_category_id !== 0
  ) {
    query.parent_category_id = params.parent_category_id;
  }

  if (params.number_of_stages != null && params.number_of_stages !== "") {
    query.number_of_stages = params.number_of_stages;
  }

  if (params.search) query.search = params.search;
  if (params.per_page != null) query.per_page = params.per_page;

  return query;
}

/**
 * Fetches public categories (taxonomy tree lookups).
 * GET /public/categories?product_type_id=&parent_category_id=&number_of_stages=
 *
 * @param {object} [params]
 * @param {{ locale?: string }} [options]
 * @returns {Promise<object[]>}
 */
export async function getTaxonomyCategories(params = {}, options = {}) {
  const { locale = "ar" } = options;

  const response = await fetchFromAPI(endpoints.categories.list, {
    params: buildCategoriesQuery(params),
    revalidate: revalidate.long,
    tags: [cacheTags.categories],
  });

  return mapTaxonomyCategories(response?.data ?? [], locale);
}

/**
 * Convenience: root categories for a product type.
 *
 * @param {string|number} productTypeId
 * @param {{ locale?: string }} [options]
 */
export async function getParentCategories(productTypeId, options = {}) {
  if (productTypeId == null || productTypeId === "") return [];
  const categories = await getTaxonomyCategories(
    { product_type_id: productTypeId },
    options,
  );

  // Keep roots only if the API returns a flat list for the type.
  const roots = categories.filter(
    (category) =>
      category.parentCategoryId == null || category.parentCategoryId === 0,
  );

  return roots.length > 0 ? roots : categories;
}

/**
 * Convenience: child categories under a parent.
 *
 * @param {string|number} parentCategoryId
 * @param {{ locale?: string, product_type_id?: string|number }} [options]
 */
export async function getChildCategories(parentCategoryId, options = {}) {
  if (parentCategoryId == null || parentCategoryId === "") return [];
  const { locale = "ar", product_type_id } = options;
  return getTaxonomyCategories(
    {
      parent_category_id: parentCategoryId,
      ...(product_type_id != null ? { product_type_id } : {}),
    },
    { locale },
  );
}
