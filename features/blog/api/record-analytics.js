import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";

const SESSION_KEY_STORAGE = "watfil_blog_session";

function getSessionKey() {
  if (typeof window === "undefined") return null;

  try {
    let key = sessionStorage.getItem(SESSION_KEY_STORAGE);
    if (!key) {
      key =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `sess-${Date.now()}`;
      sessionStorage.setItem(SESSION_KEY_STORAGE, key);
    }
    return key;
  } catch {
    return null;
  }
}

/**
 * Records a blog article view (client-side, with session dedup support).
 */
export async function recordArticleView(slug) {
  if (!slug) return;

  const sessionKey = getSessionKey();

  await fetchFromAPI(endpoints.blog.views(slug), {
    method: "POST",
    body: JSON.stringify(sessionKey ? { session_key: sessionKey } : {}),
  });
}

/**
 * Records a click on a link inside a blog article.
 * @param {string} slug - Article slug
 * @param {string} link - Link identifier (URL path)
 */
export async function recordArticleLinkClick(slug, link) {
  if (!slug || !link) return;

  await fetchFromAPI(endpoints.blog.linkClick(slug, link), {
    method: "POST",
    body: JSON.stringify({}),
  });
}
