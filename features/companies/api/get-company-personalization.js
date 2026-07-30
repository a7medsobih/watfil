import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { getCustomerTokenFromCookies } from "@/lib/auth/customer-token";

/**
 * Personalized company fields for Suspense islands.
 * Always `no-store`.
 *
 * @param {string|number} id
 * @returns {Promise<{ isLiked: boolean, myRating: number|null }>}
 */
export async function getCompanyPersonalization(id) {
  const empty = { isLiked: false, myRating: null };
  if (id == null || id === "") return empty;
  const companyId = String(id);

  const token = await getCustomerTokenFromCookies();
  if (!token) return empty;

  try {
    const response = await fetchFromAPI(endpoints.companies.detail(companyId), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const payload = response?.data ?? response;
    const myRating =
      payload?.my_rating != null && payload?.my_rating !== ""
        ? Number(payload.my_rating)
        : null;

    return {
      isLiked: Boolean(payload?.is_liked),
      myRating: Number.isFinite(myRating) ? myRating : null,
    };
  } catch {
    return empty;
  }
}
