import { GOVERNORATE_LOCALES } from "./constants";

/**
 * @param {string} pathname
 * @returns {{ locale: string | null, path: string }}
 */
export function stripLocalePrefix(pathname) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = normalized.split("/").filter(Boolean);

  if (parts.length > 0 && GOVERNORATE_LOCALES.includes(parts[0])) {
    return {
      locale: parts[0],
      path: `/${parts.slice(1).join("/")}`,
    };
  }

  return { locale: null, path: normalized === "" ? "/" : normalized };
}

/**
 * Routes that must carry a governorate query before the page renders.
 * Missing param → proxy redirect (avoids loading.js → redirect → loading.js).
 *
 * @param {string} pathname
 * @returns {{
 *   locale: string | null,
 *   kind: "companies-list" | "products-list" | "product-detail" | "company-product",
 *   paramKey: "governorate_id" | "governorate",
 *   allowsAll: boolean,
 * } | null}
 */
export function matchGovernorateSeedRoute(pathname) {
  const { locale, path } = stripLocalePrefix(pathname);

  if (path === "/companies") {
    return {
      locale,
      kind: "companies-list",
      paramKey: "governorate_id",
      allowsAll: false,
    };
  }

  if (path === "/products") {
    return {
      locale,
      kind: "products-list",
      paramKey: "governorate_id",
      allowsAll: true,
    };
  }

  if (/^\/products\/[^/]+$/.test(path)) {
    return {
      locale,
      kind: "product-detail",
      paramKey: "governorate",
      allowsAll: false,
    };
  }

  if (/^\/companies\/[^/]+\/products\/[^/]+$/.test(path)) {
    return {
      locale,
      kind: "company-product",
      paramKey: "governorate",
      allowsAll: false,
    };
  }

  return null;
}
