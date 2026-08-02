/** localStorage key for guest browsing session (max 64 chars on API). */
export const BROWSE_SESSION_STORAGE_KEY = "watfil_browse_session";

/** Max length accepted by browsing endpoints. */
export const BROWSE_SESSION_MAX_LENGTH = 64;

/** Default page size for recently viewed lists. */
export const RECENT_BROWSING_DEFAULT_LIMIT = 20;

/** Clamp for recent-* `limit` query (API: 1–50). */
export const RECENT_BROWSING_MAX_LIMIT = 50;
