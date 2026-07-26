import { getCompanies } from "./get-companies";
import { getGovernorates } from "./get-governorates";

/**
 * Companies teaser for the home page.
 *
 * The public companies endpoint requires a governorate, so we use the first
 * governorate (same default the /companies page redirects to) and cap the
 * result to `limit` via backend pagination.
 *
 * Never throws: the home page keeps rendering if the endpoint is unavailable.
 *
 * @param {{ limit?: number, locale?: string }} [options]
 * @returns {Promise<{ companies: object[], governorateId: string|number|null }>}
 */
export async function getFeaturedCompanies({ limit = 8, locale } = {}) {
  try {
    const governorates = await getGovernorates({ locale });
    const governorateId = governorates[0]?.id ?? null;

    if (governorateId == null) {
      return { companies: [], governorateId: null };
    }

    const { companies } = await getCompanies({
      governorate_id: governorateId,
      page: 1,
      per_page: limit,
      locale,
    });

    return { companies: companies.slice(0, limit), governorateId };
  } catch {
    return { companies: [], governorateId: null };
  }
}
