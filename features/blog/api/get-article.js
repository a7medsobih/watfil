import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { blogArticleTag, cacheTags, revalidate } from "@/lib/cache";
import { mapArticleDetail } from "@/features/blog/services/article.mapper";

/**
 * Fetches a single public blog article by slug.
 * Returns null when not found (404).
 */
export async function getArticle(slug) {
  if (!slug) return null;

  try {
    const response = await fetchFromAPI(endpoints.blog.detail(slug), {
      revalidate: revalidate.medium,
      tags: [cacheTags.blog, blogArticleTag(slug)],
    });

    return mapArticleDetail(response?.data ?? response);
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
}
