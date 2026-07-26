import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import {
  mapArticles,
  mapArticlesMeta,
} from "@/features/blog/services/article.mapper";

/**
 * Featured articles for the home page.
 * Backend-paginated — first page only, capped to `limit`.
 *
 * @param {{ limit?: number }} [options]
 */
export async function getFeaturedArticles({ limit = 6 } = {}) {
  const response = await fetcher(endpoints.blog.list, {
    params: {
      page: 1,
      per_page: limit,
    },
    next: {
      revalidate: revalidate.blogFeatured,
      tags: [cacheTags.blog],
    },
  });

  return {
    articles: mapArticles(response?.data ?? []).slice(0, limit),
    meta: mapArticlesMeta(response?.meta),
  };
}
