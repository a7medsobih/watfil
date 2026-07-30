import { toCompanyRouteId } from "@/features/companies/utils/company-slug";
import { toProductRouteId } from "@/features/products/utils/product-slug";
import { IMAGE_PLACEHOLDERS } from "@/lib/media/placeholders";

const PRODUCT_IMAGE_PLACEHOLDER = IMAGE_PLACEHOLDERS.product;
const COMPANY_LOGO_PLACEHOLDER = IMAGE_PLACEHOLDERS.company;
const COVERAGE_BADGE_LIMIT = 3;

function mapLocalizedName(entity, locale = "ar") {
  if (!entity) return "";
  if (locale === "en") {
    return entity.name_en ?? entity.name_ar ?? entity.name ?? "";
  }
  return entity.name_ar ?? entity.name_en ?? entity.name ?? "";
}

function mapProductType(productType, locale = "ar") {
  if (!productType) return null;

  return {
    id: productType.id,
    name: productType.name ?? "",
    nameAr: productType.name_ar ?? "",
    label:
      locale === "en"
        ? productType.name ?? productType.name_ar ?? ""
        : productType.name_ar ?? productType.name ?? "",
  };
}

function mapCategory(category, locale = "ar") {
  if (!category) return null;

  return {
    id: category.id,
    name: category.name ?? "",
    parentCategoryId: category.parent_category_id ?? null,
    productTypeId: category.product_type_id ?? null,
    numberOfStages:
      category.number_of_stages != null
        ? Number(category.number_of_stages)
        : null,
    productType: mapProductType(category.product_type, locale),
  };
}

function mapSupplier(supplier) {
  if (!supplier) return null;

  return {
    id: supplier.id,
    name: supplier.name ?? "",
    logo: supplier.logo ?? null,
    description: supplier.description ?? null,
  };
}

function mapPerks(perks = []) {
  return [...(perks ?? [])]
    .filter((perk) => perk && (perk.title || perk.icon))
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    .map((perk) => ({
      id: perk.id,
      title: perk.title ?? "",
      description: perk.description ?? null,
      type: perk.type ?? null,
      icon: perk.icon ?? null,
      sortOrder: Number(perk.sort_order ?? 0),
    }));
}

function mapInstallmentPlans(plans = []) {
  return (plans ?? []).map((plan) => ({
    months: Number(plan.months ?? 0),
    downPayment: Number(plan.down_payment ?? 0),
    installmentAmount: Number(plan.installment_amount ?? 0),
  }));
}

function toNumberOrNull(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function mapCoverage(coverage = [], locale = "ar") {
  const seen = new Set();
  const items = [];

  for (const entry of coverage) {
    const governorate = entry?.governorate;
    if (!governorate?.id) continue;

    const key = String(
      governorate.name_en ?? governorate.name_ar ?? governorate.id,
    ).toLowerCase();

    if (seen.has(key)) continue;
    seen.add(key);

    items.push({
      id: governorate.id,
      name: mapLocalizedName(governorate, locale),
    });
  }

  const visible = items.slice(0, COVERAGE_BADGE_LIMIT);
  const overflow = Math.max(0, items.length - visible.length);

  return { items: visible, overflow, total: items.length };
}

function mapOfferingCompany(company, locale = "ar") {
  if (!company) return null;

  const hasLogo = Boolean(company.logo);
  const name = company.name ?? "";
  const coverage = mapCoverage(company.coverage ?? [], locale);

  return {
    id: company.id,
    slug: toCompanyRouteId(company.id),
    name,
    logo: hasLogo ? company.logo : COMPANY_LOGO_PLACEHOLDER,
    hasLogo,
    rating: toNumberOrNull(company.average_rating),
    reviews: Number(company.ratings_count ?? 0),
    likes: Number(company.likes_count ?? 0),
    governorate: company.governorate
      ? {
          id: company.governorate.id,
          name: mapLocalizedName(company.governorate, locale),
        }
      : null,
    coverage,
    verified: Boolean(company.is_verified ?? company.verified),
  };
}

/**
 * Converts a backend product into the stable Product Model used by the UI.
 * Aligned with the public products card + company store + product detail response.
 *
 * @param {object} product
 * @param {string} [locale]
 */
export function mapProduct(product, locale = "ar") {
  if (!product) return null;

  const source =
    product.source === "catalog" || product.source === "company"
      ? product.source
      : null;

  const category = mapCategory(product.category, locale);
  const flatProductType =
    typeof product.product_type === "string"
      ? {
          id: product.product_type_id ?? null,
          name: product.product_type,
          nameAr: "",
          label:
            locale === "en"
              ? product.product_type
              : product.product_type,
          key: String(product.product_type).toLowerCase(),
        }
      : mapProductType(product.product_type, locale);

  const productType = category?.productType ?? flatProductType ?? null;

  return {
    id: product.id,
    slug: toProductRouteId(product),
    sku: product.sku ?? null,
    name: product.name ?? "",
    image: product.image || PRODUCT_IMAGE_PLACEHOLDER,
    description: product.description ?? null,
    category,
    categoryId: product.category_id ?? category?.id ?? null,
    parentCategoryId:
      product.parent_category_id ?? category?.parentCategoryId ?? null,
    productTypeId:
      product.product_type_id ?? category?.productTypeId ?? productType?.id ?? null,
    /** Raw API product_type key (e.g. "filters"). */
    productTypeKey:
      (typeof product.product_type === "string"
        ? product.product_type
        : product.product_type?.name) ??
      productType?.name ??
      null,
    supplier: mapSupplier(product.supplier),
    productType,
    numberOfStages:
      product.number_of_stages != null
        ? Number(product.number_of_stages)
        : (category?.numberOfStages ?? null),
    source,
    companyId: product.company_id ?? product.company?.id ?? null,
    /** Prefer explicit company_product_id for POST /customer/orders items. */
    companyProductId: (() => {
      const explicit =
        product.company_product_id ??
        product.company_product?.id ??
        product.companyProductId;
      if (explicit != null && explicit !== "") return Number(explicit);
      // Company-owned products use `id` as company_product_id.
      if ((product.source ?? source) === "company") return Number(product.id);
      // Catalog offerings often expose the company catalog row as `id`.
      return product.id != null ? Number(product.id) : null;
    })(),
    cashPrice: Number(product.cash_price ?? 0),
    originalPrice: toNumberOrNull(product.original_price),
    isOnSale: Boolean(product.is_on_sale),
    hasInstallment: Boolean(product.has_installment),
    installmentPlans: mapInstallmentPlans(product.installment_plans),
    hasPerks: Boolean(product.has_perks ?? product.perks?.length),
    perks: mapPerks(product.perks),
    stockStatus: product.stock_status ?? null,
    isAvailable:
      product.is_available != null ? Boolean(product.is_available) : true,
    viewsCount: Number(product.views_count ?? 0),
    offeringCompaniesCount: Number(product.offering_companies_count ?? 0),
    likesCount: Number(product.likes_count ?? 0),
    isLiked: Boolean(product.is_liked ?? product.is_wishlisted),
    /** @deprecated Prefer `isLiked` — kept for older call sites. */
    isWishlisted: Boolean(product.is_liked ?? product.is_wishlisted),
    isInCompare: Boolean(product.is_in_compare),
    rating: toNumberOrNull(product.average_rating),
    reviews: Number(product.ratings_count ?? 0),
    createdAt: product.created_at ?? null,
  };
}

export function mapProducts(products = [], locale = "ar") {
  return products
    .map((product) => mapProduct(product, locale))
    .filter(Boolean);
}

export function mapProductsMeta(meta) {
  return {
    total: meta?.total ?? 0,
    currentPage: meta?.current_page ?? 1,
    lastPage: meta?.last_page ?? 1,
    perPage: meta?.per_page ?? 15,
  };
}

/**
 * Maps a company offering for a catalog product in a governorate.
 * API shape: `{ company, product }` (product carries cash/installment/perks).
 *
 * @param {object} entry
 * @param {string} [locale]
 */
export function mapProductOffering(entry, locale = "ar") {
  if (!entry) return null;

  const companyPayload = entry.company ?? entry;
  const productPayload = entry.product ?? entry.offering ?? null;
  const company = mapOfferingCompany(companyPayload, locale);
  if (!company) return null;

  const mapped = productPayload ? mapProduct(productPayload, locale) : null;
  const product = mapped
    ? {
        ...mapped,
        source: productPayload.source ?? mapped.source ?? "catalog",
        likeSource: productPayload.source ?? mapped.source ?? "catalog",
        companyId:
          (productPayload.source ?? mapped.source) === "company"
            ? (company.id ?? null)
            : (mapped.companyId ?? null),
      }
    : null;

  return {
    id: `${company.id}-${product?.id ?? "offer"}`,
    company,
    product,
  };
}

export function mapProductOfferings(entries = [], locale = "ar") {
  return (entries ?? [])
    .map((entry) => mapProductOffering(entry, locale))
    .filter(Boolean);
}
