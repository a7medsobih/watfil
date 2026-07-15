/**
 * @typedef {Object} NavItem
 * @property {string} key - Translation key suffix under `nav.*`
 * @property {string} href - Locale-agnostic path
 * @property {boolean} [auth] - Whether the route requires authentication
 */

/** @type {NavItem[]} */
export const NAV_ITEMS = [
  {
    key: "home",
    href: "/",
    auth: false,
  },
  {
    key: "products",
    href: "/products",
    auth: false,
  },
  {
    key: "companies",
    href: "/companies",
    auth: false,
  },
  {
    key: "blog",
    href: "/blog",
    auth: false,
  },
];

/**
 * Filter nav items for the current auth state.
 * @param {NavItem[]} items
 * @param {boolean} isAuthenticated
 */
export function getVisibleNavItems(items = NAV_ITEMS, isAuthenticated = false) {
  return items.filter((item) => !item.auth || isAuthenticated);
}
