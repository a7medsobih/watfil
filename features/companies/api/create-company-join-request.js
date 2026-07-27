import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";

/**
 * Submit a public company join request (no auth).
 * Does not create a company account.
 *
 * @param {{
 *   company_name: string,
 *   tax_number: string,
 *   governorate_id: number,
 *   contact_name: string,
 *   phone: string,
 *   email: string,
 *   notes?: string,
 * }} payload
 */
export async function createCompanyJoinRequest(payload) {
  return fetchFromAPI(endpoints.companyJoinRequests.create, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(payload),
  });
}
