import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/request";

/**
 * Create or update the authenticated customer's company rating.
 * @param {string|number} companyId
 * @param {{ rating: number, comment?: string|null }} payload
 * @param {string} token
 */
export async function rateCompany(companyId, payload, token) {
  return apiRequest(endpoints.companies.rating(companyId), {
    method: "POST",
    token,
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
  return apiRequest(endpoints.companies.rating(companyId), {
    method: "DELETE",
    token,
  });
}
