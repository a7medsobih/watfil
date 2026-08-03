/**
 * Single Source of Truth — display specs for API-uploaded images.
 *
 * Scope: images uploaded via Company dashboard or Super Admin (not static
 * assets under @/assets or /public). Dimensions reflect CURRENT CSS display
 * sizes (audit snapshot) — not recommended upload targets.
 *
 * `source` values:
 * - `company` — uploaded from company dashboard
 * - `super_admin` — uploaded from Super Admin dashboard
 * - `company_or_super_admin` — same UI slot; origin depends on product.source
 *   (`company` product → company; `catalog`/supplier product → super_admin)
 *
 * Tailwind size reference: size-N ≈ N × 4px (size-10 = 40px).
 *
 * @typedef {'company' | 'super_admin' | 'company_or_super_admin'} ImageSource
 * @typedef {'cover' | 'contain' | null} ObjectFit
 * @typedef {{
 *   label: string,
 *   source: ImageSource,
 *   width: number | null,
 *   height: number | null,
 *   ratio: string | null,
 *   usedIn: string[],
 *   objectFit: ObjectFit,
 *   css?: string,
 *   field?: string,
 *   notes?: string,
 * }} ImageSpec
 */

/** @type {Record<string, ImageSpec>} */
export const IMAGE_SPECS = {
  // ─── Products ───────────────────────────────────────────────────────────

  PRODUCT_CARD_THUMBNAIL: {
    label: "Product Card Thumbnail",
    source: "company_or_super_admin",
    width: 900,
    height: 900,
    ratio: "1:1",
    usedIn: [
      "components/common/ProductCard",
      "home/products",
      "products list",
      "category details",
      "company store products",
      "similar products",
      "wishlist products",
    ],
    objectFit: "cover",
    css: "container: aspect-square; img: h-full w-full (+ HTML width/height 900)",
    field: "product.image",
    notes:
      "HTML width/height=900 is a hint; actual box is fluid aspect-square. Catalog images: super_admin supplier-products; company products: company dashboard.",
  },

  PRODUCT_HERO_MAIN: {
    label: "Product Gallery Main",
    source: "company_or_super_admin",
    width: 320,
    height: 240,
    ratio: "4:3",
    usedIn: [
      "features/products/components/details/ProductHero",
      "catalog product detail",
      "company offer product detail",
    ],
    objectFit: "cover",
    css: "frame: aspect-4/3; grid col max ~18–20rem (max-w-sm on mobile)",
    field: "product.image",
  },

  PRODUCT_HERO_SELLER_LOGO: {
    label: "Product Hero Seller Logo",
    source: "super_admin",
    width: 48,
    height: 48,
    ratio: "1:1",
    usedIn: ["features/products/components/details/ProductHero"],
    objectFit: "cover",
    css: "size-10 sm:size-12 (40→48px)",
    field: "company.logo",
    notes: "Logo upload documented on Super Admin company create/update (§5.8).",
  },

  RECENT_PRODUCT_CARD_THUMBNAIL: {
    label: "Recent Product Card Thumbnail",
    source: "company_or_super_admin",
    width: null,
    height: null,
    ratio: "1:1",
    usedIn: [
      "features/browsing/components/RecentProductCard",
      "recently-viewed",
    ],
    objectFit: "cover",
    css: "container: aspect-square (fluid)",
    field: "product.image",
  },

  CART_ITEM_THUMBNAIL: {
    label: "Cart Item Thumbnail",
    source: "company_or_super_admin",
    width: 64,
    height: 64,
    ratio: "1:1",
    usedIn: [
      "features/cart/components/CartItemRow",
      "MiniCart sheet",
    ],
    objectFit: "cover",
    css: "size-16",
    field: "item.image",
  },

  CHECKOUT_ITEM_THUMBNAIL: {
    label: "Checkout Item Thumbnail",
    source: "company_or_super_admin",
    width: 56,
    height: 56,
    ratio: "1:1",
    usedIn: ["features/checkout/components/CheckoutSummary"],
    objectFit: "cover",
    css: "size-14",
    field: "item.image",
  },

  // ─── Company logos ──────────────────────────────────────────────────────

  COMPANY_CARD_COVER: {
    label: "Company Card Cover (Logo as banner)",
    source: "super_admin",
    width: null,
    height: 176,
    ratio: null,
    usedIn: [
      "components/common/CompanyCard",
      "home/companies",
      "companies list",
      "wishlist companies",
    ],
    objectFit: "cover",
    css: "container: h-44 w-full (176px × full card width)",
    field: "company.logo",
    notes:
      "Logo used as full-bleed cover. Upload via Super Admin companies (§5.8).",
  },

  COMPANY_INFO_LOGO: {
    label: "Company Logo",
    source: "super_admin",
    width: 96,
    height: 96,
    ratio: "1:1",
    usedIn: [
      "features/companies/components/store/CompanyInfoCard",
      "company store /companies/[id]",
    ],
    objectFit: "cover",
    css: "size-20 sm:size-24 (80→96px)",
    field: "company.logo",
  },

  OFFERING_COMPANY_LOGO: {
    label: "Offering Company Logo",
    source: "super_admin",
    width: 48,
    height: 48,
    ratio: "1:1",
    usedIn: [
      "features/products/components/details/ProductOfferingCompanyCard",
      "catalog product offerings list",
    ],
    objectFit: "cover",
    css: "size-12",
    field: "company.logo",
  },

  RECENT_STORE_CARD_COVER: {
    label: "Recent Store Card Cover",
    source: "super_admin",
    width: null,
    height: 160,
    ratio: null,
    usedIn: [
      "features/browsing/components/RecentStoreCard",
      "recently-viewed stores",
    ],
    objectFit: "cover",
    css: "h-36 sm:h-40 w-full (144→160px)",
    field: "company.logo",
  },

  MINI_CART_COMPANY_LOGO: {
    label: "Mini Cart Company Logo",
    source: "super_admin",
    width: 40,
    height: 40,
    ratio: "1:1",
    usedIn: ["features/cart/components/MiniCart"],
    objectFit: "cover",
    css: "size-10",
    field: "company.logo",
  },

  CHECKOUT_COMPANY_LOGO: {
    label: "Checkout Company Logo",
    source: "super_admin",
    width: 44,
    height: 44,
    ratio: "1:1",
    usedIn: ["features/checkout/components/CheckoutSummary"],
    objectFit: "cover",
    css: "size-11",
    field: "company.logo",
  },

  CART_CONFLICT_COMPANY_LOGO: {
    label: "Cart Conflict Company Logo",
    source: "super_admin",
    width: 40,
    height: 40,
    ratio: "1:1",
    usedIn: [
      "features/cart/components/CartCompanyConflictDialog",
    ],
    objectFit: "cover",
    css: "size-10 (current + pending company slots)",
    field: "company.logo / pendingCompany.logo",
  },

  NAVBAR_CAMPAIGN_BRAND_LOGO: {
    label: "Navbar Campaign Brand Logo",
    source: "super_admin",
    width: 36,
    height: 36,
    ratio: "1:1",
    usedIn: [
      "components/layout/navbar/NavbarBrand",
      "CampaignNavbar / company brand context",
    ],
    objectFit: "cover",
    css: "size-8 sm:size-9; HTML width/height 36",
    field: "brand.logo (company.logo)",
  },

  CAMPAIGN_FOOTER_BRAND_LOGO: {
    label: "Campaign Footer Brand Logo",
    source: "super_admin",
    width: 32,
    height: 32,
    ratio: "1:1",
    usedIn: ["components/layout/CampaignFooter"],
    objectFit: "cover",
    css: "size-8; HTML width/height 36",
    field: "brand.logo (company.logo)",
  },

  STORE_SHARE_IDENTITY_LOGO: {
    label: "Store Share Identity Logo",
    source: "super_admin",
    width: 64,
    height: 64,
    ratio: "1:1",
    usedIn: [
      "features/companies/components/share/StoreSharePage",
      "/store/[taxNumber]",
    ],
    objectFit: "contain",
    css: "size-14 sm:size-16; img: object-contain p-1.5",
    field: "store.logo",
    notes: "Only API logo slot that overrides MediaImage default to object-contain.",
  },

  // ─── Company hero / identity / billboards ───────────────────────────────

  COMPANY_HERO_BILLBOARD: {
    label: "Billboard Hero Slide",
    source: "super_admin",
    width: null,
    height: 500,
    ratio: null,
    usedIn: [
      "features/companies/components/store/CompanyHeroGallery",
      "buildHeroSlides (kind=billboard)",
      "company store /companies/[id]",
    ],
    objectFit: "cover",
    css: "h-[240px] sm:h-[340px] md:h-[440px] lg:h-[500px] w-full",
    field: "billboard.image",
    notes:
      "Managed via /api/super-admin/billboards (§10.4); public GET …/companies/{id}/billboards (§2.21). Wins over gallery when billboards.length > 0.",
  },

  COMPANY_COVER_GALLERY: {
    label: "Company Cover Banner / Gallery Slide",
    source: "company",
    width: null,
    height: 500,
    ratio: null,
    usedIn: [
      "features/companies/components/store/CompanyHeroGallery",
      "buildHeroSlides (kind=gallery)",
      "company store /companies/[id]",
      "campaign experience (billboards suppressed)",
    ],
    objectFit: "cover",
    css: "h-[240px] sm:h-[340px] md:h-[440px] lg:h-[500px] w-full",
    field: "company.gallery[].url",
    notes:
      "Fallback hero when no billboards. Related to company identity imagery (/api/company/identity-images §10.5).",
  },

  STORE_SHARE_HERO_BANNER: {
    label: "Store Share Hero Banner",
    source: "company",
    width: null,
    height: 420,
    ratio: null,
    usedIn: [
      "features/companies/components/share/StoreShareHero",
      "/store/[taxNumber]",
    ],
    objectFit: "cover",
    css: "h-[240px] sm:h-[340px] md:h-[420px] w-full; object-cover object-center",
    field: "store.identityImages[]",
    notes: "Company identity images (§10.5 / §2.22).",
  },

  TEAM_MEMBER_PHOTO: {
    label: "Team Member Photo",
    source: "company",
    width: null,
    height: null,
    ratio: "4:5",
    usedIn: [
      "features/companies/components/store/TeamMemberCard",
      "company store Team tab",
    ],
    objectFit: "cover",
    css: "container: aspect-[4/5]; img: h-full w-full object-cover",
    field: "member.photo",
    notes:
      "Comes from company detail `team` payload. Dedicated upload endpoint not listed in FRONTEND_ENDPOINTS guide — treated as company-owned store content.",
  },

  // ─── Blog (Super Admin) ─────────────────────────────────────────────────

  BLOG_CARD_THUMBNAIL: {
    label: "Blog Card Thumbnail",
    source: "super_admin",
    width: 104,
    height: 139,
    ratio: "3:4",
    usedIn: [
      "components/common/BlogCard",
      "home blog section",
      "/blog list",
    ],
    objectFit: "cover",
    css: "aspect-[3/4] w-[88px] sm:w-[104px]",
    field: "article.featuredImage",
  },

  BLOG_FEATURED_CARD_THUMBNAIL: {
    label: "Blog Featured Card Thumbnail",
    source: "super_admin",
    width: 200,
    height: 267,
    ratio: "3:4",
    usedIn: [
      "features/blog/components/BlogFeaturedCard",
      "/blog featured",
    ],
    objectFit: "cover",
    css: "aspect-[3/4] w-full max-w-[180px] sm:w-[160px] md:w-[200px]",
    field: "article.featuredImage",
  },

  BLOG_ARTICLE_HERO: {
    label: "Blog Cover",
    source: "super_admin",
    width: null,
    height: null,
    ratio: "2:1",
    usedIn: [
      "features/blog/components/BlogArticlePage",
      "/blog/[slug]",
    ],
    objectFit: "cover",
    css: "aspect-[2/1] w-full inside max-w-4xl frame",
    field: "article.featuredImage",
  },

  BLOG_SIDEBAR_RELATED_THUMB: {
    label: "Blog Sidebar Related Thumbnail",
    source: "super_admin",
    width: 80,
    height: 64,
    ratio: "5:4",
    usedIn: [
      "features/blog/components/BlogArticleSidebar",
      "/blog/[slug] sidebar",
    ],
    objectFit: "cover",
    css: "h-16 w-20",
    field: "article.featuredImage",
  },

  BLOG_ARTICLE_AUTHOR_AVATAR: {
    label: "Blog Author Avatar",
    source: "super_admin",
    width: 24,
    height: 24,
    ratio: "1:1",
    usedIn: [
      "features/blog/components/BlogArticlePage",
      "/blog/[slug]",
    ],
    objectFit: "cover",
    css: "Avatar size=sm → size-6; AvatarImage object-cover",
    field: "article.author.avatar",
  },

  BLOG_ARTICLE_BODY_IMAGES: {
    label: "Blog Article Body Images",
    source: "super_admin",
    width: null,
    height: null,
    ratio: null,
    usedIn: [
      "features/blog/components/BlogArticleContent",
      "styles/globals.css .article-content img",
      "/blog/[slug] body HTML",
    ],
    objectFit: null,
    css: "max-width: 100%; height: auto; border-radius: 1rem",
    field: "inline <img> in article.body HTML",
    notes:
      "PROBLEM: no object-fit — browser default / intrinsic sizing only.",
  },
};

/**
 * @param {keyof typeof IMAGE_SPECS} key
 * @returns {ImageSpec | undefined}
 */
export function getImageSpec(key) {
  return IMAGE_SPECS[key];
}

/**
 * @param {ImageSource} source
 * @returns {ImageSpec[]}
 */
export function listImageSpecsBySource(source) {
  return Object.values(IMAGE_SPECS).filter((spec) => spec.source === source);
}
