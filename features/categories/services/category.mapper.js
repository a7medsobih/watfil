/**
 * Converts a backend category into the stable Category Model used by the UI.
 */
export function mapCategory(category) {
  if (!category) return null;

  return {
    id: category.id,
    name: category.name ?? "",
    parentId: category.parent_category_id ?? null,
  };
}

export function mapCategories(categories = []) {
  return categories.map(mapCategory).filter(Boolean);
}
