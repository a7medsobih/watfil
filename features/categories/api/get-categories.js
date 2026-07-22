import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { mapCategories } from "@/features/categories/services/category.mapper";

/**
 * Fetches public product categories.
 * @returns {Promise<object[]>}
 */
export async function getCategories() {
  const response = await fetcher(endpoints.categories.list, {
    next: {
      revalidate: revalidate.medium,
      tags: [cacheTags.categories],
    },
  });

  return mapCategories(response?.data ?? []);
}
