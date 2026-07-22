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
    list: "/public/companies",
    detail: (slug) => `/public/companies/${slug}`,
  },
  governorates: {
    list: "/public/governorates",
  },
  categories: {
    list: "/public/categories",
    detail: (slug) => `/public/categories/${slug}`,
  },
  blog: {
    list: "/public/blog/articles",
    detail: (slug) => `/public/blog/articles/${slug}`,
  },
  search: "/search",
  likes: {
    products: "/customer/likes/products",
    catalog: (supplierProductId) =>
      `/customer/products/catalog/${supplierProductId}/like`,
    company: (companyId, productId) =>
      `/customer/companies/${companyId}/products/${productId}/like`,
  },
  compare: {
    list: "/compare",
  },
  cart: {
    list: "/cart",
    sync: "/cart/sync",
  },
  auth: {
    checkPhone: "/customer/auth/check-phone",
    login: "/customer/login",
    requestOtp: "/customer/register/request-otp",
    verifyRegister: "/customer/register/verify",
    logout: "/customer/logout",
    me: "/customer/me",
    profile: "/customer/profile",
  },
};
