import { apiClient, resolveFetchUrl } from "./client";

/**
 * Generic fetch wrapper for API requests.
 */
export async function fetcher(path, options = {}) {
  const { params, headers, ...rest } = options;
  const url = resolveFetchUrl(path, params);

  const response = await fetch(url, {
    ...rest,
    headers: {
      ...apiClient.headers,
      ...headers,
    },
  });

  if (!response.ok) {
    const error = new Error(`Request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}
