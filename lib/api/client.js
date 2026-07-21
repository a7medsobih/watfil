const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

/**
 * Shared API client configuration.
 */
export const apiClient = {
  baseUrl: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Joins base URL from env with a path + optional query params.
 * Preserves base path segments (e.g. `/api`) — absolute paths like `/public/...`
 * must not wipe the env base path via `new URL(path, base)`.
 */
export function buildUrl(path, params) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = apiClient.baseUrl
    ? new URL(`${apiClient.baseUrl}${normalizedPath}`)
    : new URL(normalizedPath, "http://localhost");

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) url.searchParams.set(key, String(value));
    });
  }

  return apiClient.baseUrl ? url.toString() : `${normalizedPath}${url.search}`;
}
