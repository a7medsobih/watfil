/**
 * Cookie bridge so Server Components can send Authorization
 * on public product fetches (is_liked / likes_count).
 * Token remains in the auth store for client API calls.
 */
export const CUSTOMER_TOKEN_COOKIE = "watfil_customer_token";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function setCustomerTokenCookie(token) {
  if (typeof document === "undefined") return;

  if (!token) {
    clearCustomerTokenCookie();
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CUSTOMER_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function clearCustomerTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${CUSTOMER_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/**
 * Read customer bearer token in Server Components / Route Handlers.
 * @returns {Promise<string|null>}
 */
export async function getCustomerTokenFromCookies() {
  try {
    const { cookies } = await import("next/headers");
    const store = await cookies();
    const value = store.get(CUSTOMER_TOKEN_COOKIE)?.value;
    return value ? decodeURIComponent(value) : null;
  } catch {
    return null;
  }
}
