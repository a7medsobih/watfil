import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import {
  mapArticles,
  mapArticlesMeta,
} from "@/features/blog/services/article.mapper";

/**
 * Featured articles for the home page.
 * Uses backend pagination — first page, 3 items only.
 */
export async function getFeaturedArticles() {
  const response = await fetcher(endpoints.blog.list, {
    params: {
      page: 1,
      per_page: 3,
    },
    next: {
      revalidate: revalidate.blogFeatured,
      tags: [cacheTags.blog],
    },
  });

  return {
    articles: mapArticles(response?.data ?? []),
    meta: mapArticlesMeta(response?.meta),
  };
}
