import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { mapStatistics } from "@/features/home/services/statistics.mapper";

/**
 * Fetches public platform statistics for the home page.
 */
export async function getStatistics() {
  const response = await fetchFromAPI(endpoints.statistics, {
    revalidate: revalidate.long,
    tags: [cacheTags.statistics],
  });

  return mapStatistics(response?.data ?? {});
}
