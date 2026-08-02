import { buildCatalogProductHref } from "@/features/products/utils/resolve-product-detail-params";

/**
 * Resolves the catalog product href for a billboard from API product ids.
 * No extra fetch — uses ids already present on the billboard payload.
 *
 * @param {object} billboard
 * @param {{ governorate?: string|number|null }} [options]
 * @returns {string|null}
 */
function resolveBillboardHref(billboard, { governorate = null } = {}) {
  const productId =
    billboard?.supplierProductId ??
    billboard?.product?.id ??
    billboard?.target?.productId ??
    null;

  if (productId == null || productId === "") return null;

  return buildCatalogProductHref(productId, { governorate });
}

/**
 * Normalizes gallery images into hero slides (non-clickable).
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
 * Normalizes billboards into hero slides with catalog product hrefs.
 * @param {object[]} billboards
 * @param {{ governorate?: string|number|null }} [options]
 */
function mapBillboardSlides(billboards = [], { governorate = null } = {}) {
  return (billboards ?? [])
    .filter((item) => item?.image)
    .map((item) => ({
      id: `billboard-${item.id}`,
      url: item.image,
      kind: "billboard",
      href: resolveBillboardHref(item, { governorate }),
      productName: item.product?.name || null,
    }));
}

/**
 * Data adapter: single source of truth for CompanyHeroGallery slides.
 *
 * billboards.length > 0 → billboards only (ads → catalog product)
 * otherwise → company.gallery (cover / identity)
 *
 * Campaign callers pass `billboards: []` to keep gallery hero without ads.
 *
 * @param {{
 *   billboards?: object[],
 *   gallery?: Array<{ id?: string|number, url?: string }>,
 *   governorate?: string|number|null,
 *   locale?: string,
 * }} [input]
 */
export async function buildHeroSlides({
  billboards = [],
  gallery = [],
  governorate = null,
} = {}) {
  if (Array.isArray(billboards) && billboards.length > 0) {
    return mapBillboardSlides(billboards, { governorate });
  }

  return mapGallerySlides(gallery);
}
