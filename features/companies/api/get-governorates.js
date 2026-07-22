import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { mapGovernorates } from "@/features/companies/services/company.mapper";

/**
 * Fetches public governorates (deduped) for companies tabs.
 *
 * @param {object} [options]
 * @param {string} [options.locale]
 * @returns {Promise<object[]>}
 */
export async function getGovernorates(options = {}) {
  const response = await fetcher(endpoints.governorates.list, {
    next: {
      revalidate: revalidate.medium,
      tags: [cacheTags.governorates],
    },
  });

  return mapGovernorates(response?.data ?? [], options.locale);
}
