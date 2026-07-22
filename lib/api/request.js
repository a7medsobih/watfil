import { apiClient, resolveFetchUrl } from "./client";

/**
 * API request with structured errors and optional Bearer auth.
 */
export async function apiRequest(path, options = {}) {
  const { params, headers, token, ...rest } = options;
  const url = resolveFetchUrl(path, params);

  const response = await fetch(url, {
    ...rest,
    headers: {
      ...apiClient.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message =
      (body && typeof body === "object" && (body.message || body.error)) ||
      (response.status === 419
        ? "Session expired. Please try again."
        : `Request failed: ${response.status}`);

    const error = new Error(message);
    error.status = response.status;
    error.data = body;
    error.errors =
      body && typeof body === "object" ? body.errors || null : null;
    throw error;
  }

  return body;
}
