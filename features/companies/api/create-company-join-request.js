import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/request";

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
  return apiRequest(endpoints.companyJoinRequests.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
