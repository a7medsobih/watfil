/**
 * Whether a product type represents water filters (stages filter applies).
 *
 * @param {{ key?: string, name?: string, nameAr?: string } | string | null | undefined} productType
 */
export function isFiltersProductType(productType) {
  if (productType == null) return false;

  const key =
    typeof productType === "string"
      ? productType
      : productType.key || productType.name || "";

  return String(key).trim().toLowerCase() === "filters";
}
