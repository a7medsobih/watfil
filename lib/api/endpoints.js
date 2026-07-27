/**
 * Central API endpoint paths.
 */
export const endpoints = {
  products: {
    list: "/public/products",
    detail: (id) => `/public/products/${id}`,
    companies: (id) => `/public/products/${id}/companies`,
    similar: (id) => `/public/products/${id}/similar`,
  },
  statistics: "/public/statistics",
  companies: {
    list: "/public/companies",
    topRated: "/public/companies/top-rated",
    detail: (id) => `/public/companies/${id}`,
    products: (id) => `/public/companies/${id}/products`,
    productsSimilar: (companyId) =>
      `/public/companies/${companyId}/products/similar`,
    productDetails: (companyId) =>
      `/public/companies/${companyId}/product-details`,
    like: (companyId) => `/customer/companies/${companyId}/like`,
    /** Links customer ↔ company (required before POST /customer/orders). */
    link: (companyId) => `/customer/companies/${companyId}/link`,
    rating: (companyId) => `/customer/companies/${companyId}/rating`,
  },
  /** Public company store share page by tax number (no auth). */
  store: {
    detail: (taxNumber) => `/public/store/${encodeURIComponent(taxNumber)}`,
  },
  governorates: {
    list: "/public/governorates",
  },
  companyJoinRequests: {
    create: "/public/company-join-requests",
  },
  categories: {
    list: "/public/categories",
    detail: (slug) => `/public/categories/${slug}`,
  },
  blog: {
    list: "/public/blog/articles",
    detail: (slug) => `/public/blog/articles/${encodeURIComponent(slug)}`,
    categories: "/public/blog/categories",
    tags: "/public/blog/tags",
    views: (slug) =>
      `/public/blog/articles/${encodeURIComponent(slug)}/views`,
    linkClick: (slug, link) =>
      `/public/blog/articles/${encodeURIComponent(slug)}/links/${encodeURIComponent(link)}/clicks`,
    companyArticles: (company) =>
      `/public/companies/${encodeURIComponent(company)}/blog-articles`,
  },
  seo: {
    sitemap: "/public/sitemap.xml",
    resolveRedirect: "/public/redirects/resolve",
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
  orders: {
    list: "/customer/orders",
    create: "/customer/orders",
    detail: (orderId) => `/customer/orders/${orderId}`,
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
