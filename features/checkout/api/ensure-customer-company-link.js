import { apiRequest } from "@/lib/api/request";
import { endpoints } from "@/lib/api/endpoints";

/**
 * Ensure the authenticated customer is linked to the seller company.
 * Backend rule: orders require an existing customer–company relation.
 *
 * Tries POST /customer/companies/{company}/link (idempotent when already linked).
 * Ignores 404/405 if the route is not deployed yet.
 *
 * @param {string|number} companyId
 * @param {string} token
 * @returns {Promise<{ linked: boolean, via: string|null }>}
 */
export async function ensureCustomerCompanyLink(companyId, token) {
  const id = Number(companyId);
  if (!Number.isFinite(id) || id <= 0 || !token) {
    return { linked: false, via: null };
  }

  try {
    await apiRequest(endpoints.companies.link(id), {
      method: "POST",
      token,
      body: JSON.stringify({}),
    });
    return { linked: true, via: "link" };
  } catch (error) {
    const status = error?.status;

    // Already linked / validation that still means relation exists.
    if (status === 200 || status === 201 || status === 204) {
      return { linked: true, via: "link" };
    }
    if (status === 422) {
      const message = String(error?.message || "").toLowerCase();
      const dataMessage = String(error?.data?.message || "").toLowerCase();
      if (
        message.includes("already") ||
        message.includes("مرتبط") ||
        dataMessage.includes("already") ||
        dataMessage.includes("مرتبط")
      ) {
        return { linked: true, via: "link" };
      }
    }

    // Endpoint missing — caller will rely on order source.channel=link.
    if (status === 404 || status === 405) {
      return { linked: false, via: null };
    }

    // Auth / other errors — surface to caller.
    if (status === 401 || status === 403) {
      throw error;
    }

    return { linked: false, via: null };
  }
}
