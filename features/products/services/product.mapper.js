const PRODUCT_IMAGE_PLACEHOLDER = "/images/product-placeholder.webp";

function mapCategory(category) {
  if (!category) return null;

  return {
    id: category.id,
    name: category.name ?? "",
  };
}

function mapSupplier(supplier) {
  if (!supplier) return null;

  return {
    id: supplier.id,
    name: supplier.name ?? "",
  };
}

function mapSlug(product) {
  if (product.slug) return String(product.slug);
  if (product.sku) return String(product.sku);
  return String(product.id);
}

function toNumberOrNull(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/**
 * Converts a backend product into the stable Product Model used by the UI.
 * Aligned with the public products card response.
 */
export function mapProduct(product) {
  if (!product) return null;

  return {
    id: product.id,
    slug: mapSlug(product),
    name: product.name ?? "",
    image: product.image || PRODUCT_IMAGE_PLACEHOLDER,
    description: product.description ?? null,
    category: mapCategory(product.category),
    supplier: mapSupplier(product.supplier),
    companyId: product.company_id ?? product.company?.id ?? null,
    cashPrice: Number(product.cash_price ?? 0),
    originalPrice: toNumberOrNull(product.original_price),
    isOnSale: Boolean(product.is_on_sale),
    hasInstallment: Boolean(product.has_installment),
    offeringCompaniesCount: Number(product.offering_companies_count ?? 0),
    likesCount: Number(product.likes_count ?? 0),
    isLiked: Boolean(product.is_liked ?? product.is_wishlisted),
    /** @deprecated Prefer `isLiked` — kept for older call sites. */
    isWishlisted: Boolean(product.is_liked ?? product.is_wishlisted),
    isInCompare: Boolean(product.is_in_compare),
    rating: toNumberOrNull(product.average_rating),
    reviews: Number(product.ratings_count ?? 0),
  };
}

export function mapProducts(products = []) {
  return products.map(mapProduct).filter(Boolean);
}

export function mapProductsMeta(meta) {
  return {
    total: meta?.total ?? 0,
    currentPage: meta?.current_page ?? 1,
    lastPage: meta?.last_page ?? 1,
    perPage: meta?.per_page ?? 15,
  };
}
