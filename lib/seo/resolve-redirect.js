import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";

/**
 * Resolves a legacy path to a new URL via the backend redirect service.
 * @param {string} path - Path including leading slash (e.g. /blog/old-slug)
 * @returns {Promise<string | null>} Target path or null
 */
export async function resolveRedirect(path) {
  if (!path) return null;

  try {
    const response = await fetcher(endpoints.seo.resolveRedirect, {
      params: { path },
      next: { revalidate: 3600 },
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
