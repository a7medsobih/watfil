/**
 * Maps a backend product type into the stable Taxonomy ProductType model.
 *
 * @param {object} productType
 * @param {string} [locale]
 */
export function mapProductType(productType, locale = "ar") {
  if (!productType) return null;

  const name = productType.name ?? "";
  const nameAr = productType.name_ar ?? "";
  const label =
    locale === "en" ? name || nameAr : nameAr || name;

  return {
    id: productType.id,
    name,
    nameAr,
    label,
    /** Canonical key used for type-specific UI (e.g. filters → stages). */
    key: String(name).toLowerCase(),
  };
}

/**
 * @param {object[]} [productTypes]
 * @param {string} [locale]
 */
export function mapProductTypes(productTypes = [], locale = "ar") {
  return (productTypes ?? [])
    .map((item) => mapProductType(item, locale))
    .filter(Boolean);
}
