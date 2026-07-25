/**
 * Builds a URL-safe slug from a company name (Arabic + Latin).
 * Spaces → hyphens; keeps Arabic letters and digits.
 */
export function slugifyCompanyName(name = "") {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/gi, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Pretty company path segment: `{name-slug}-{id}`.
 * ID suffix is required because the public API resolves by id only.
 */
export function buildCompanySlug(name, id) {
  if (id == null || id === "") return "";
  const base = slugifyCompanyName(name);
  return base ? `${base}-${id}` : String(id);
}

/**
 * Extracts the company id from a route param.
 * Supports `{slug}-{id}`, bare `{id}`, and legacy numeric paths.
 * @param {string|number} param
 * @returns {string|null}
 */
export function resolveCompanyIdFromParam(param) {
  if (param == null || param === "") return null;

  const value = decodeURIComponent(String(param)).trim();
  if (!value) return null;

  if (/^\d+$/.test(value)) return value;

  const match = value.match(/-(\d+)$/);
  return match ? match[1] : null;
}
