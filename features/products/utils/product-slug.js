/**
 * Temporary: public product routes use numeric id until the backend supports slug.
 * @param {object|string|number|null|undefined} productOrId
 * @returns {string}
 */
export function toProductRouteId(productOrId) {
  if (productOrId == null || productOrId === "") return "";

  if (typeof productOrId === "object") {
    return productOrId.id != null ? String(productOrId.id) : "";
  }

  return String(productOrId);
}
