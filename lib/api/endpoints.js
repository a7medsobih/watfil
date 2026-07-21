/**
 * Central API endpoint paths.
 */
export const endpoints = {
  products: {
    list: "/public/products",
    detail: (id) => `/public/products/${id}`,
  },
  statistics: "/public/statistics",
  companies: {
    list: "/companies",
    detail: (slug) => `/companies/${slug}`,
  },
  categories: {
    list: "/categories",
    detail: (slug) => `/categories/${slug}`,
  },
  blog: {
    list: "/blog",
    detail: (slug) => `/blog/${slug}`,
  },
  search: "/search",
  wishlist: {
    list: "/wishlist",
    sync: "/wishlist/sync",
  },
  compare: {
    list: "/compare",
  },
  cart: {
    list: "/cart",
    sync: "/cart/sync",
  },
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
};
