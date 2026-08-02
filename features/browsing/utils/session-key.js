import {
  BROWSE_SESSION_MAX_LENGTH,
  BROWSE_SESSION_STORAGE_KEY,
} from "@/features/browsing/constants";

/**
 * Returns a stable guest browsing session key from localStorage.
 * Creates one (UUID-based, ≤ 64 chars) when missing.
 * Safe to call from the browser only; returns null on the server.
 *
 * @returns {string | null}
 */
export function getSessionKey() {
  if (typeof window === "undefined") return null;

  try {
    let value = localStorage.getItem(BROWSE_SESSION_STORAGE_KEY);

    if (!value) {
      value =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID().replace(/-/g, "").slice(0, 32)
          : `sess${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

      localStorage.setItem(
        BROWSE_SESSION_STORAGE_KEY,
        value.slice(0, BROWSE_SESSION_MAX_LENGTH),
      );
      value = localStorage.getItem(BROWSE_SESSION_STORAGE_KEY);
    }

    return value ? value.slice(0, BROWSE_SESSION_MAX_LENGTH) : null;
  } catch {
    return null;
  }
}

/**
 * Peek at an existing session key without creating one.
 * @returns {string | null}
 */
export function peekSessionKey() {
  if (typeof window === "undefined") return null;

  try {
    const value = localStorage.getItem(BROWSE_SESSION_STORAGE_KEY);
    return value ? value.slice(0, BROWSE_SESSION_MAX_LENGTH) : null;
  } catch {
    return null;
  }
}
