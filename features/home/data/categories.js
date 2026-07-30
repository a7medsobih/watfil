/**
 * Home categories mock data.
 * Shape mirrors the expected API response — swap this source later without touching UI.
 *
 * @typedef {{ ar: string, en: string }} LocalizedString
 * @typedef {{
 *   id: number,
 *   slug: string,
 *   name: LocalizedString,
 *   icon: string,
 * }} Category
 */

/** @type {Category[]} */
export const categories = [
  {
    id: 1,
    slug: "household",
    name: {
      ar: "فلاتر للمنزل",
      en: "Home filters",
    },
    icon: "home",
  },
  {
    id: 2,
    slug: "industrial",
    name: {
      ar: "حلول للمنشآت",
      en: "Facility systems",
    },
    icon: "factory",
  },
  {
    id: 3,
    slug: "reverse-osmosis",
    name: {
      ar: "أنظمة RO",
      en: "RO systems",
    },
    icon: "droplets",
  },
  {
    id: 4,
    slug: "uv-sterilization",
    name: {
      ar: "تعقيم بالـ UV",
      en: "UV disinfection",
    },
    icon: "sun",
  },
  {
    id: 5,
    slug: "alkaline",
    name: {
      ar: "مياه قلوية",
      en: "Alkaline water",
    },
    icon: "flask",
  },
  {
    id: 6,
    slug: "spare-parts",
    name: {
      ar: "قطع غيار أصلية",
      en: "Genuine parts",
    },
    icon: "wrench",
  },
];
