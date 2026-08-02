/**
 * Central public/runtime environment for the Watfil frontend.
 * Prefer importing from here instead of reading `process.env` ad hoc.
 *
 * Vercel: set these under Project Settings → Environment Variables for
 * Production, Preview, and Development, then redeploy (NEXT_PUBLIC_* are
 * inlined at build time).
 */

function trimTrailingSlash(value) {
  return String(value || "").replace(/\/$/, "");
}

const apiUrl = trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL);
const siteUrl = trimTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
);

export const env = {
  /** Backend API base including `/api` when applicable. */
  apiUrl,
  /** Canonical site origin (no trailing slash). */
  siteUrl,
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  /** Extra API timing logs when `API_DEBUG=1`. */
  apiDebug: process.env.API_DEBUG === "1",
};

/** @returns {string} */
export function getApiUrl() {
  return env.apiUrl;
}

/** @returns {string} */
export function getSiteUrl() {
  return env.siteUrl;
}

/**
 * Hostname of the API origin (for `images.remotePatterns`).
 * @returns {string | null}
 */
export function getApiHostname() {
  if (!env.apiUrl) return null;
  try {
    return new URL(env.apiUrl).hostname;
  } catch {
    return null;
  }
}
