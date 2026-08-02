import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";
import { LIKE_TYPE } from "@/features/wishlist/types";

/**
 * Build the unified likes request body.
 * @param {{ type: string, id: string|number, companyId?: string|number }} params
 */
export function buildLikeBody({ type, id, companyId }) {
  const body = {
    type,
    id: Number(id),
  };

  if (type === LIKE_TYPE.COMPANY_PRODUCT) {
    if (companyId == null || companyId === "") {
      throw new Error("company_id is required for company_product likes");
    }
    body.company_id = Number(companyId);
  }

  return body;
}

/**
 * Parse POST/DELETE /customer/likes response.
 * Reads `data.company` or `data.product` — never treats `data` as the entity.
 *
 * @param {unknown} response
 * @returns {{
 *   type: string|null,
 *   isLiked: boolean|null,
 *   likesCount: number|null,
 *   averageRating: number|null,
 *   ratingsCount: number|null,
 *   entity: object|null,
 * }}
 */
export function parseLikeResponse(response) {
  const data = response?.data ?? null;
  if (!data || typeof data !== "object") {
    return {
      type: null,
      isLiked: null,
      likesCount: null,
      averageRating: null,
      ratingsCount: null,
      entity: null,
    };
  }

  const type = data.type ?? null;
  const entity =
    (type === LIKE_TYPE.COMPANY ? data.company : null) ??
    data.company ??
    data.product ??
    null;

  if (!entity || typeof entity !== "object") {
    return {
      type,
      isLiked: null,
      likesCount: null,
      averageRating: null,
      ratingsCount: null,
      entity: null,
    };
  }

  return {
    type,
    isLiked: entity.is_liked != null ? Boolean(entity.is_liked) : null,
    likesCount:
      entity.likes_count != null ? Number(entity.likes_count) : null,
    averageRating:
      entity.average_rating != null ? Number(entity.average_rating) : null,
    ratingsCount:
      entity.ratings_count != null ? Number(entity.ratings_count) : null,
    entity,
  };
}

/**
 * Unified like / unlike — POST or DELETE `/customer/likes`.
 *
 * @param {{
 *   type: 'company'|'company_product'|'catalog_product',
 *   id: string|number,
 *   companyId?: string|number,
 *   liked: boolean,
 * }} params
 * @param {string} token
 * @returns {Promise<{ type: string|null, isLiked: boolean|null, likesCount: number|null, averageRating: number|null, ratingsCount: number|null, entity: object|null, raw: unknown }>}
 */
export async function setLike(params, token) {
  const body = buildLikeBody(params);
  const response = await fetchFromAPI(endpoints.likes.all, {
    method: params.liked ? "POST" : "DELETE",
    token,
    cache: "no-store",
    body: JSON.stringify(body),
  });

  return {
    ...parseLikeResponse(response),
    raw: response,
  };
}

/** @param {Parameters<typeof setLike>[0]} params @param {string} token */
export function like(params, token) {
  return setLike({ ...params, liked: true }, token);
}

/** @param {Parameters<typeof setLike>[0]} params @param {string} token */
export function unlike(params, token) {
  return setLike({ ...params, liked: false }, token);
}
