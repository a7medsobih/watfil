import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";

/**
 * POST /customer/orders
 * @param {object} body
 * @param {string} token
 */
export async function createCustomerOrder(body, token) {
  if (!token) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  return fetchFromAPI(endpoints.orders.create, {
    method: "POST",
    token,
    cache: "no-store",
    body: JSON.stringify(body),
  });
}
