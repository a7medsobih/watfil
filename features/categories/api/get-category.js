import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { getTaxonomyCategories } from "@/features/taxonomy/api";
import { mapTaxonomyCategory } from "@/features/taxonomy/services";

/**
 * Fetches a single public category by slug or id.
 * Prefers GET /public/categories/{slug}; falls back to list match.
 *
 * @param {string} slugOrId
 * @param {{ locale?: string }} [options]
 * @returns {Promise<object|null>}
 */
export async function getCategory(slugOrId, options = {}) {
  const { locale = "ar" } = options;
  if (slugOrId == null || slugOrId === "") return null;

  const key = decodeURIComponent(String(slugOrId));

  try {
    const response = await fetchFromAPI(endpoints.categories.detail(key), {
      revalidate: revalidate.long,
      tags: [cacheTags.categories],
    });
    const mapped = mapTaxonomyCategory(response?.data ?? response, locale);
    if (mapped) return mapped;
  } catch (error) {
    if (error?.status && error.status !== 404) throw error;
  }

  const categories = await getTaxonomyCategories({}, { locale });
  return (
    categories.find(
      (category) =>
        String(category.slug) === key || String(category.id) === key,
    ) ?? null
  );
}
