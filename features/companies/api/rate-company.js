import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";

/**
 * Create or update the authenticated customer's company rating.
 * @param {string|number} companyId
 * @param {{ rating: number, comment?: string|null }} payload
 * @param {string} token
 */
export async function rateCompany(companyId, payload, token) {
  return fetchFromAPI(endpoints.companies.rating(companyId), {
    method: "POST",
    token,
    cache: "no-store",
    body: JSON.stringify({
      rating: Number(payload.rating),
      ...(payload.comment !== undefined
        ? { comment: payload.comment }
        : {}),
    }),
  });
}

/**
 * Delete the authenticated customer's company rating.
 * @param {string|number} companyId
 * @param {string} token
 */
export async function deleteCompanyRating(companyId, token) {
  return fetchFromAPI(endpoints.companies.rating(companyId), {
    method: "DELETE",
    token,
    cache: "no-store",
  });
}
