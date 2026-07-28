/**
 * Resolves a frontend product-detail href for a billboard.
 * Prefers supplier_product_id / target.product_id; falls back to target.path.
 *
 * @param {object} billboard
 * @returns {string|null}
 */
function resolveBillboardHref(billboard) {
  const productId =
    billboard?.supplierProductId ?? billboard?.target?.productId ?? null;

  if (productId != null && productId !== "") {
    return `/products/${encodeURIComponent(String(productId))}`;
  }

  const path = billboard?.target?.path;
  if (typeof path !== "string" || !path.trim()) return null;

  const match = path.match(/\/products\/([^/?#]+)/i);
  if (!match?.[1]) return null;

  return `/products/${encodeURIComponent(match[1])}`;
}

/**
 * Normalizes gallery images into hero slides.
 * @param {Array<{ id?: string|number, url?: string }>} gallery
 */
function mapGallerySlides(gallery = []) {
  return (gallery ?? [])
    .filter((item) => item?.url)
    .map((item) => ({
      id: item.id ?? item.url,
      url: item.url,
      kind: "gallery",
      href: null,
    }));
}

/**
 * Normalizes billboards into hero slides.
 * @param {object[]} billboards
 */
function mapBillboardSlides(billboards = []) {
  return (billboards ?? [])
    .filter((item) => item?.image)
    .map((item) => ({
      id: `billboard-${item.id}`,
      url: item.image,
      kind: "billboard",
      href: resolveBillboardHref(item),
    }));
}

/**
 * Data adapter: single source of truth for CompanyHeroGallery slides.
 *
 * billboards.length > 0 → billboards only
 * otherwise → company.gallery (current behaviour)
 *
 * @param {{
 *   billboards?: object[],
 *   gallery?: Array<{ id?: string|number, url?: string }>,
 * }} [input]
 * @returns {Array<{
 *   id: string|number,
 *   url: string,
 *   kind: 'gallery'|'billboard',
 *   href: string|null,
 * }>}
 */
export function buildHeroSlides({ billboards = [], gallery = [] } = {}) {
  if (Array.isArray(billboards) && billboards.length > 0) {
    return mapBillboardSlides(billboards);
  }

  return mapGallerySlides(gallery);
}
