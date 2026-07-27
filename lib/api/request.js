import { fetchFromAPI } from "./fetcher";

/**
 * API request with structured errors and optional Bearer auth.
 * Delegates to the unified `fetchFromAPI` (mutations always `no-store`).
 */
export async function apiRequest(path, options = {}) {
  const { cache, revalidate, tags, ...rest } = options;
  const method = String(rest.method || "GET").toUpperCase();
  const isMutation = method !== "GET" && method !== "HEAD";

  return fetchFromAPI(path, {
    ...rest,
    // Auth / wishlist / cart / search callers should pass cache: 'no-store'.
    // Mutations are forced to no-store inside fetchFromAPI regardless.
    ...(isMutation
      ? { cache: "no-store" }
      : cache != null || revalidate != null || tags
        ? { cache, revalidate, tags }
        : { cache: "no-store" }),
  });
}
