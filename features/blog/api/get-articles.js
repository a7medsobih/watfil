import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import {
  mapArticles,
  mapArticlesMeta,
} from "@/features/blog/services/article.mapper";

/**
 * Builds API query params from Search Params / callers.
 * Ready for future: search, category, tag — without rewriting this module.
 * @param {object} [params]
 */
function buildQueryParams(params = {}) {
  const query = {
    page: params.page ?? 1,
    per_page: params.per_page ?? 15,
  };

  if (params.search != null && params.search !== "") {
    query.search = params.search;
  }

  if (params.category != null && params.category !== "") {
    query.category = params.category;
  }

  if (params.tag != null && params.tag !== "") {
    query.tag = params.tag;
  }

  return query;
}

/**
 * Fetches paginated public blog articles from the backend.
 * Relies entirely on backend pagination (no client-side paging).
 *
 * @param {object} [params]
 * @returns {Promise<{ articles: object[], meta: object }>}
 */
export async function getArticles(params = {}) {
  const response = await fetcher(endpoints.blog.list, {
    params: buildQueryParams(params),
    next: {
      revalidate: revalidate.blogList,
      tags: [cacheTags.blog],
    },
  });

  return {
    articles: mapArticles(response?.data ?? []),
    meta: mapArticlesMeta(response?.meta),
  };
}
