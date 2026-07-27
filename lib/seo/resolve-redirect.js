import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { revalidate } from "@/lib/cache";

/**
 * Resolves a legacy path to a new URL via the backend redirect service.
 * @param {string} path - Path including leading slash (e.g. /blog/old-slug)
 * @returns {Promise<string | null>} Target path or null
 */
export async function resolveRedirect(path) {
  if (!path) return null;

  try {
    const response = await fetchFromAPI(endpoints.seo.resolveRedirect, {
      params: { path },
      revalidate: revalidate.long,
    });

    const target =
      response?.data?.to ??
      response?.data?.target ??
      response?.to ??
      response?.target ??
      null;

    return target ? String(target) : null;
  } catch {
    return null;
  }
}
