const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Shared API client configuration.
 */
export const apiClient = {
  baseUrl: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

export function buildUrl(path, params) {
  const url = new URL(path, apiClient.baseUrl || "http://localhost");
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) url.searchParams.set(key, String(value));
    });
  }
  return apiClient.baseUrl ? url.toString() : `${path}${url.search}`;
}
