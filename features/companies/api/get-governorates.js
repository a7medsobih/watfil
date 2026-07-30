import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { mapGovernorates } from "@/features/companies/services/governorate.mapper";

/**
 * Fetches public governorates (deduped) for companies tabs.
 *
 * @param {object} [options]
 * @param {string} [options.locale]
 * @returns {Promise<object[]>}
 */
export async function getGovernorates(options = {}) {
  const response = await fetchFromAPI(endpoints.governorates.list, {
    revalidate: revalidate.long,
    tags: [cacheTags.governorates],
  });

  return mapGovernorates(response?.data ?? [], options.locale);
}
