/**
 * Maps a backend blog category to a stable UI model.
 */
export function mapCategory(category) {
  if (!category) return null;

  return {
    id: category.id,
    name: category.name ?? "",
    slug: String(category.slug ?? category.id),
    parentId: category.parent_id ?? category.parentId ?? null,
    articlesCount: Number(
      category.articles_count ?? category.articlesCount ?? 0,
    ),
    description: category.description ?? "",
  };
}

export function mapCategories(categories = []) {
  return categories.map(mapCategory).filter(Boolean);
}

/**
 * Groups flat categories by parent for nav rendering.
 * @param {ReturnType<typeof mapCategory>[]} categories
 */
export function groupCategoriesByParent(categories = []) {
  const roots = categories.filter((c) => !c.parentId);
  const childrenMap = new Map();

  for (const category of categories) {
    if (!category.parentId) continue;
    const key = String(category.parentId);
    if (!childrenMap.has(key)) childrenMap.set(key, []);
    childrenMap.get(key).push(category);
  }

  return { roots, childrenMap };
}
