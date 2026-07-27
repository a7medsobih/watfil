import { fetchFromAPI } from "@/lib/api/fetcher";
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

  if (params.category_slug != null && params.category_slug !== "") {
    query.category_slug = params.category_slug;
  }

  if (params.tag_slug != null && params.tag_slug !== "") {
    query.tag_slug = params.tag_slug;
  }

  if (params.blog_category_id != null && params.blog_category_id !== "") {
    query.blog_category_id = params.blog_category_id;
  }

  if (params.company_id != null && params.company_id !== "") {
    query.company_id = params.company_id;
  }

  if (params.product_id != null && params.product_id !== "") {
    query.product_id = params.product_id;
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
  const isSearch = Boolean(params.search);

  const response = await fetchFromAPI(endpoints.blog.list, {
    params: buildQueryParams(params),
    ...(isSearch
      ? { cache: "no-store" }
      : {
          revalidate: revalidate.long,
          tags: [cacheTags.blog],
        }),
  });

  return {
    articles: mapArticles(response?.data ?? []),
    meta: mapArticlesMeta(response?.meta),
  };
}
