import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { mapCategories } from "@/features/blog/services/category.mapper";

/**
 * Fetches public blog categories (supports parent_id tree from backend).
 */
export async function getBlogCategories() {
  const response = await fetcher(endpoints.blog.categories, {
    next: {
      revalidate: revalidate.blogList,
      tags: [cacheTags.blog],
    },
  });

  return mapCategories(response?.data ?? response ?? []);
}
