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
 *   count: number,
 * }} Category
 */

/** @type {Category[]} */
export const categories = [
  {
    id: 1,
    slug: "household",
    name: {
      ar: "منزلي",
      en: "Household",
    },
    icon: "home",
    count: 248,
  },
  {
    id: 2,
    slug: "industrial",
    name: {
      ar: "صناعي",
      en: "Industrial",
    },
    icon: "factory",
    count: 86,
  },
  {
    id: 3,
    slug: "reverse-osmosis",
    name: {
      ar: "تناضح عكسي",
      en: "Reverse Osmosis",
    },
    icon: "droplets",
    count: 192,
  },
  {
    id: 4,
    slug: "uv-sterilization",
    name: {
      ar: "تعقيم UV",
      en: "UV Sterilization",
    },
    icon: "sun",
    count: 64,
  },
  {
    id: 5,
    slug: "alkaline",
    name: {
      ar: "قلوي",
      en: "Alkaline",
    },
    icon: "flask",
    count: 53,
  },
  {
    id: 6,
    slug: "spare-parts",
    name: {
      ar: "قطع غيار",
      en: "Spare Parts",
    },
    icon: "wrench",
    count: 317,
  },
];
