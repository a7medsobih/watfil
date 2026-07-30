import { getProduct } from "@/features/products/api";
import { buildCatalogProductHref } from "@/features/products/utils/resolve-product-detail-params";
import { buildProductSlug } from "@/features/products/utils/product-slug";

/**
 * Resolves the SEO catalog product href for a billboard.
 * Billboard ads always target Watfil catalog products via `supplier_product_id`.
 *
 * @param {object} billboard
 * @param {{ governorate?: string|number|null, locale?: string }} [options]
 * @returns {Promise<string|null>}
 */
async function resolveBillboardHref(
  billboard,
  { governorate = null, locale = "ar" } = {},
) {
  const productId =
    billboard?.supplierProductId ??
    billboard?.product?.id ??
    billboard?.target?.productId ??
    null;

  if (productId == null || productId === "") return null;

  // Prefer live catalog product (canonical SEO slug).
  const catalogProduct = await getProduct(productId, locale);
  if (catalogProduct?.slug) {
    return buildCatalogProductHref(catalogProduct, { governorate });
  }

  // Fallback from embedded billboard product payload (sku + id → slug).
  const embedded = billboard?.product;
  if (embedded) {
    const embeddedSlug =
      embedded.slug ||
      buildProductSlug({
        id: embedded.id ?? productId,
        sku: embedded.sku,
      });

    if (embeddedSlug) {
      return buildCatalogProductHref(embeddedSlug, { governorate });
    }
  }

  // Last resort: id path — product detail route resolves id → canonical slug.
  return buildCatalogProductHref(String(productId), { governorate });
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
 * @param {{ governorate?: string|number|null, locale?: string }} [options]
 */
async function mapBillboardSlides(
  billboards = [],
  { governorate = null, locale = "ar" } = {},
) {
  const rows = (billboards ?? []).filter((item) => item?.image);

  return Promise.all(
    rows.map(async (item) => ({
      id: `billboard-${item.id}`,
      url: item.image,
      kind: "billboard",
      href: await resolveBillboardHref(item, { governorate, locale }),
      productName: item.product?.name || null,
    })),
  );
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
  locale = "ar",
} = {}) {
  if (Array.isArray(billboards) && billboards.length > 0) {
    return mapBillboardSlides(billboards, { governorate, locale });
  }

  return mapGallerySlides(gallery);
}
