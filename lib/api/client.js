import { env } from "@/lib/env";

const API_BASE_URL = env.apiUrl;

/**
 * Shared API client configuration.
 */
export const apiClient = {
  baseUrl: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

/**
 * Server-side fetches must have an absolute API base URL.
 * A missing `NEXT_PUBLIC_API_URL` on Vercel yields relative paths like
 * `/public/products/1`, which Node `fetch` rejects → silent 500s.
 *
 * @returns {string}
 */
export function requireApiBaseUrl() {
  if (apiClient.baseUrl) return apiClient.baseUrl;

  const message =
    "NEXT_PUBLIC_API_URL is not configured. Set it in Vercel Project Settings → Environment Variables (Production + Preview).";
  console.error(`[api] ${message}`);
  const error = new Error(message);
  error.status = 500;
  error.code = "MISSING_API_URL";
  throw error;
}

/**
 * Joins base URL from env with a path + optional query params.
 * Preserves base path segments (e.g. `/api`) — absolute paths like `/public/...`
 * must not wipe the env base path via `new URL(path, base)`.
 */
export function buildUrl(path, params) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // On the server, never emit a relative URL — it crashes Node fetch.
  if (typeof window === "undefined" && !apiClient.baseUrl) {
    requireApiBaseUrl();
  }

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

/**
 * Browser calls go through the Next.js `/api/backend` proxy so Laravel
 * Sanctum does not apply CSRF (419) to cross-origin SPA POSTs.
 * Server components / route handlers still call the API directly.
 */
export function resolveFetchUrl(path, params) {
  if (typeof window === "undefined") {
    return buildUrl(path, params);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(normalizedPath, "http://local.invalid");

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) url.searchParams.set(key, String(value));
    });
  }

  return `/api/backend${normalizedPath}${url.search}`;
}
