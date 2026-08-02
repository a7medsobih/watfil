import { env } from "@/lib/env";

import { apiClient, resolveFetchUrl } from "./client";

/** Default upstream timeout — under typical Vercel serverless limits. */
export const DEFAULT_FETCH_TIMEOUT_MS = 12_000;

/**
 * Merge caller AbortSignal with a timeout signal.
 * @param {AbortSignal | undefined} signal
 * @param {number} timeoutMs
 * @returns {{ signal: AbortSignal, cleanup: () => void }}
 */
function withTimeoutSignal(signal, timeoutMs) {
  if (timeoutMs == null || timeoutMs <= 0) {
    return { signal, cleanup: () => {} };
  }

  const controller = new AbortController();
  const onAbort = () => controller.abort(signal?.reason);
  if (signal) {
    if (signal.aborted) {
      controller.abort(signal.reason);
    } else {
      signal.addEventListener("abort", onAbort, { once: true });
    }
  }

  const timer = setTimeout(() => {
    controller.abort(
      Object.assign(new Error(`Request timed out after ${timeoutMs}ms`), {
        name: "TimeoutError",
        code: "FETCH_TIMEOUT",
      }),
    );
  }, timeoutMs);

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      if (signal) signal.removeEventListener("abort", onAbort);
    },
  };
}

/**
 * Unified Next.js fetch wrapper with cache controls + timeout.
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
 * @param {number} [options.timeoutMs] - Abort after ms (default 12000)
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
    timeoutMs = DEFAULT_FETCH_TIMEOUT_MS,
    signal: outerSignal,
    ...rest
  } = options;

  const url = resolveFetchUrl(path, params);
  const method = String(rest.method || "GET").toUpperCase();
  const isMutation = method !== "GET" && method !== "HEAD";
  const startedAt = Date.now();

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

  const { signal, cleanup } = withTimeoutSignal(outerSignal, timeoutMs);
  init.signal = signal;

  let response;
  try {
    response = await fetch(url, init);
  } catch (cause) {
    cleanup();
    const reason = signal?.reason;
    const timedOut =
      cause?.name === "TimeoutError" ||
      cause?.code === "FETCH_TIMEOUT" ||
      reason?.name === "TimeoutError" ||
      reason?.code === "FETCH_TIMEOUT";

    const message = timedOut
      ? `Upstream API timed out after ${timeoutMs}ms (${method} ${path})`
      : `Upstream API unreachable (${method} ${path}): ${cause?.message || cause}`;

    console.error(`[api] ${message}`, {
      url,
      method,
      path,
      ms: Date.now() - startedAt,
      code: cause?.code || cause?.name,
    });

    const error = new Error(message);
    error.status = timedOut ? 504 : 502;
    error.code = timedOut ? "FETCH_TIMEOUT" : "FETCH_NETWORK";
    error.cause = cause;
    throw error;
  }

  cleanup();

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

    console.error(`[api] ${method} ${path} ← ${response.status}`, {
      url,
      ms: Date.now() - startedAt,
      message: typeof message === "string" ? message.slice(0, 300) : message,
      contentType,
    });

    const error = new Error(
      typeof message === "string" ? message : `Request failed: ${response.status}`,
    );
    error.status = response.status;
    error.data = body;
    error.errors =
      body && typeof body === "object" ? body.errors || null : null;
    throw error;
  }

  // Successful HTTP but non-JSON (e.g. HTML error page / login wall) must not
  // be passed to mappers — that serializes junk into the RSC payload.
  if (!isJson) {
    const message = `Upstream API returned non-JSON response (${method} ${path}, ${contentType || "unknown type"})`;
    console.error(`[api] ${message}`, {
      url,
      ms: Date.now() - startedAt,
      preview: typeof body === "string" ? body.slice(0, 200) : null,
    });
    const error = new Error(message);
    error.status = 502;
    error.code = "NON_JSON_RESPONSE";
    error.data = body;
    throw error;
  }

  if (env.isDev || env.apiDebug) {
    console.info(`[api] ${method} ${path} ← ${response.status} ${Date.now() - startedAt}ms`);
  }

  return body;
}

/**
 * @deprecated Prefer `fetchFromAPI`. Kept as a thin alias for gradual migration.
 */
export async function fetcher(path, options = {}) {
  return fetchFromAPI(path, options);
}
