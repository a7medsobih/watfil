import { buildProductSlug } from "@/features/products/utils/product-slug";

/**
 * Resolves product-detail query params (governorate filter for offering companies).
 *
 * @param {Record<string, string | string[] | undefined>} [searchParams]
 * @param {{ defaultGovernorateId?: string | number | null }} [options]
 */
export function resolveProductDetailParams(searchParams = {}, options = {}) {
  const read = (key) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const governorate =
    read("governorate") ?? options.defaultGovernorateId ?? null;

  return {
    governorate_id: governorate,
  };
}

/**
 * Low-level product detail href from an already-resolved SEO slug.
 *
 * @param {string|number} slug
 * @param {{ governorate?: string|number|null }} [params]
 */
export function buildProductDetailHref(slug, { governorate } = {}) {
  if (slug == null || slug === "") return null;

  const base = `/products/${encodeURIComponent(String(slug))}`;
  const query = new URLSearchParams();

  if (governorate != null && governorate !== "") {
    query.set("governorate", String(governorate));
  }

  const qs = query.toString();
  return qs ? `${base}?${qs}` : base;
}

/**
 * Single source of truth for catalog product URLs across the site.
 * Always uses the SEO product slug (never raw id/sku in the path).
 *
 * @param {object|string|number|null|undefined} productOrSlug
 *   Product model (`slug` / `id`+`sku`) or a precomputed slug string.
 * @param {{ governorate?: string|number|null }} [params]
 * @returns {string|null}
 */
export function buildCatalogProductHref(productOrSlug, { governorate } = {}) {
  if (productOrSlug == null || productOrSlug === "") return null;

  let slug = null;

  if (typeof productOrSlug === "string" || typeof productOrSlug === "number") {
    slug = String(productOrSlug);
  } else {
    slug =
      productOrSlug.slug ||
      buildProductSlug(productOrSlug) ||
      null;
  }

  if (!slug) return null;

  return buildProductDetailHref(slug, { governorate });
}
