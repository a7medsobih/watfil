/**
 * Temporary: public company routes use numeric id until the backend supports slug.
 * @param {string|number|null|undefined} id
 * @returns {string}
 */
export function toCompanyRouteId(id) {
  if (id == null || id === "") return "";
  return String(id);
}
