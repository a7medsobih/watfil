import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";

/**
 * Like a company.
 * @param {string|number} companyId
 * @param {string} token
 */
export async function likeCompany(companyId, token) {
  return fetchFromAPI(endpoints.companies.like(companyId), {
    method: "POST",
    token,
    cache: "no-store",
  });
}

/**
 * Unlike a company.
 * @param {string|number} companyId
 * @param {string} token
 */
export async function unlikeCompany(companyId, token) {
  return fetchFromAPI(endpoints.companies.like(companyId), {
    method: "DELETE",
    token,
    cache: "no-store",
  });
}
