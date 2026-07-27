import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { mapCategories } from "@/features/blog/services/category.mapper";

/**
 * Fetches public blog categories (supports parent_id tree from backend).
 */
export async function getBlogCategories() {
  const response = await fetchFromAPI(endpoints.blog.categories, {
    revalidate: revalidate.long,
    tags: [cacheTags.blog],
  });

  return mapCategories(response?.data ?? response ?? []);
}
