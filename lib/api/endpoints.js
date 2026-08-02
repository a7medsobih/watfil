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
    billboards: (id) => `/public/companies/${id}/billboards`,
    productsSimilar: (companyId) =>
      `/public/companies/${companyId}/products/similar`,
    productDetails: (companyId) =>
      `/public/companies/${companyId}/product-details`,
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
  productTypes: {
    list: "/public/product-types",
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
  likes: {
    /**
     * Unified customer likes.
     * POST / DELETE / GET → `/customer/likes`
     * Body: `{ type, id, company_id? }` where type is
     * `company` | `company_product` | `catalog_product`.
     */
    all: "/customer/likes",
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
    /** Direct register — supports company_id (creates customer_company_links). */
    register: "/customer/register",
    requestOtp: "/customer/register/request-otp",
    /** OTP verify — does NOT support company_id (no company link). */
    verifyRegister: "/customer/register/verify",
    logout: "/customer/logout",
    me: "/customer/me",
    profile: "/customer/profile",
  },
  browsing: {
    storeVisit: "/public/browsing/stores/visit",
    productView: "/public/browsing/products/view",
    recentProducts: "/public/browsing/recent-products",
    recentStores: "/public/browsing/recent-stores",
    customerRecentProducts: "/customer/browsing/recent-products",
    customerRecentStores: "/customer/browsing/recent-stores",
  },
};
