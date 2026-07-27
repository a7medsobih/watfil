import { apiClient, resolveFetchUrl } from "./client";

/**
 * Unified Next.js fetch wrapper with cache controls.
 *
 * @param {string} path - API path (e.g. `/public/products`)
 * @param {object} [options]
 * @param {object} [options.params] - Query string params
 * @param {HeadersInit} [options.headers]
 * @param {string} [options.token] - Bearer token
 * @param {number} [options.revalidate] - ISR seconds → `next.revalidate`
 * @param {string[]} [options.tags] - Cache tags → `next.tags`
 * @param {RequestCache} [options.cache] - e.g. `'no-store'` for auth/search/cart
 * @param {AbortSignal} [options.signal]
 * @param {string} [options.method]
 * @param {string|BodyInit} [options.body]
 * @param {object} [options.next] - Legacy `next` override (merged with revalidate/tags)
 * @returns {Promise<any>} Parsed JSON body (or text)
 */
export async function fetchFromAPI(path, options = {}) {
  const {
    params,
    headers,
    token,
    revalidate: revalidateSeconds,
    tags,
    cache,
    next: nextOption,
    ...rest
  } = options;

  const url = resolveFetchUrl(path, params);
  const method = String(rest.method || "GET").toUpperCase();
  const isMutation = method !== "GET" && method !== "HEAD";

  /** @type {RequestInit & { next?: { revalidate?: number|false, tags?: string[] } }} */
  const init = {
    ...rest,
    method,
    headers: {
      ...apiClient.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  // Mutations must never be cached.
  if (isMutation || cache === "no-store") {
    init.cache = "no-store";
  } else {
    const nextConfig = { ...(nextOption || {}) };
    if (revalidateSeconds != null) nextConfig.revalidate = revalidateSeconds;
    if (tags?.length) nextConfig.tags = tags;
    if (Object.keys(nextConfig).length > 0) {
      init.next = nextConfig;
    } else if (cache) {
      init.cache = cache;
    }
  }

  const response = await fetch(url, init);

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson
    ? await response.json().catch(() => null)
    : await response.text();

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

/**
 * @deprecated Prefer `fetchFromAPI`. Kept as a thin alias for gradual migration.
 */
export async function fetcher(path, options = {}) {
  return fetchFromAPI(path, options);
}
