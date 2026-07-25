import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/request";

/**
 * Like a company.
 * @param {string|number} companyId
 * @param {string} token
 */
export async function likeCompany(companyId, token) {
  return apiRequest(endpoints.companies.like(companyId), {
    method: "POST",
    token,
  });
}

/**
 * Unlike a company.
 * @param {string|number} companyId
 * @param {string} token
 */
export async function unlikeCompany(companyId, token) {
  return apiRequest(endpoints.companies.like(companyId), {
    method: "DELETE",
    token,
  });
}
