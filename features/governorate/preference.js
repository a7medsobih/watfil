import {
  GOVERNORATE_ALL,
  GOVERNORATE_COOKIE,
  GOVERNORATE_COOKIE_MAX_AGE,
} from "./constants";

/**
 * @param {string | null | undefined} value
 * @returns {boolean}
 */
export function isGovernorateAll(value) {
  return value === GOVERNORATE_ALL;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isGovernorateId(value) {
  if (value == null || value === "") return false;
  if (isGovernorateAll(value)) return false;
  return true;
}

/**
 * Parse preference from a raw Cookie header string (Edge/Node request).
 * @param {string | null | undefined} cookieHeader
 * @returns {string | null}
 */
export function readGovernoratePreferenceFromHeader(cookieHeader) {
  if (!cookieHeader) return null;

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (rawKey !== GOVERNORATE_COOKIE) continue;
    const raw = rest.join("=");
    if (!raw) return null;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  return null;
}

/**
 * @param {{ get: (name: string) => { value: string } | undefined }} cookies
 * @returns {string | null}
 */
export function readGovernoratePreferenceFromStore(cookies) {
  const value = cookies?.get?.(GOVERNORATE_COOKIE)?.value;
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Read preference in Server Components / Route Handlers.
 * @returns {Promise<string | null>}
 */
export async function getGovernoratePreferenceFromCookies() {
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    return readGovernoratePreferenceFromStore(store);
  } catch {
    return null;
  }
}

/**
 * Cookie options shared by proxy + client writers.
 * @returns {{ path: string, maxAge: number, sameSite: "lax", secure?: boolean }}
 */
export function governorateCookieOptions(secure = false) {
  return {
    path: "/",
    maxAge: GOVERNORATE_COOKIE_MAX_AGE,
    sameSite: "lax",
    ...(secure ? { secure: true } : {}),
  };
}

/**
 * Attach preference cookie onto a NextResponse redirect/pass-through.
 * @param {import("next/server").NextResponse} response
 * @param {string | number | null | undefined} value
 * @param {{ secure?: boolean }} [options]
 */
export function applyGovernoratePreferenceCookie(
  response,
  value,
  { secure = false } = {},
) {
  if (value == null || value === "") return response;

  response.cookies.set(
    GOVERNORATE_COOKIE,
    encodeURIComponent(String(value)),
    governorateCookieOptions(secure),
  );

  return response;
}

/**
 * Persist browse preference in the browser (user selection).
 * @param {string | number | null | undefined} value - numeric id or `"all"`
 */
export function setGovernoratePreferenceClient(value) {
  if (typeof document === "undefined") return;

  if (value == null || value === "") {
    document.cookie = `${GOVERNORATE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }

  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `${GOVERNORATE_COOKIE}=${encodeURIComponent(String(value))}; Path=/; Max-Age=${GOVERNORATE_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}
