import { mapProductType } from "./product-type.mapper";

/**
 * Maps a backend category into the stable Taxonomy Category model.
 *
 * @param {object} category
 * @param {string} [locale]
 */
export function mapTaxonomyCategory(category, locale = "ar") {
  if (!category) return null;

  return {
    id: category.id,
    name: category.name ?? "",
    slug: category.slug ?? (category.id != null ? String(category.id) : null),
    parentCategoryId: category.parent_category_id ?? null,
    /** @deprecated Prefer parentCategoryId — kept for older call sites. */
    parentId: category.parent_category_id ?? null,
    productTypeId: category.product_type_id ?? null,
    numberOfStages:
      category.number_of_stages != null
        ? Number(category.number_of_stages)
        : null,
    productType: mapProductType(category.product_type, locale),
  };
}

/**
 * @param {object[]} [categories]
 * @param {string} [locale]
 */
export function mapTaxonomyCategories(categories = [], locale = "ar") {
  return (categories ?? [])
    .map((item) => mapTaxonomyCategory(item, locale))
    .filter(Boolean);
}
