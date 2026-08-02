import {
  PRICE_MAX,
  PRICE_MIN,
  PRODUCTS_PER_PAGE,
} from "@/features/filters/constants";

export { PRICE_MIN, PRICE_MAX, PRICE_STEP } from "@/features/filters/constants";

/**
 * Resolves products list query from Next.js searchParams.
 * Param names match GET /public/products (§2.18) + number_of_stages
 * (documented for taxonomy / company products; same snake_case key).
 *
 * @param {Record<string, string | string[] | undefined>} [searchParams]
 */
export function resolveProductsParams(searchParams = {}) {
  const read = (key) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const minPrice = read("min_price");
  const maxPrice = read("max_price");

  return {
    page: Number(read("page")) > 0 ? Number(read("page")) : 1,
    per_page:
      Number(read("per_page")) > 0
        ? Number(read("per_page"))
        : PRODUCTS_PER_PAGE,
    search: read("search") || null,
    product_type_id: read("product_type_id") || null,
    parent_category_id: read("parent_category_id") || null,
    category_id: read("category_id") || null,
    number_of_stages: read("number_of_stages") || null,
    governorate_id: read("governorate_id") || null,
    min_price: minPrice != null && minPrice !== "" ? Number(minPrice) : null,
    max_price: maxPrice != null && maxPrice !== "" ? Number(maxPrice) : null,
  };
}

/**
 * Builds a /products href from filter state.
 * Omits default bounds and empty values so links stay shareable and clean.
 *
 * @param {object} params
 */
export function buildProductsHref(params = {}) {
  const query = new URLSearchParams();

  if (params.search) query.set("search", String(params.search));
  if (params.product_type_id) {
    query.set("product_type_id", String(params.product_type_id));
  }
  if (params.parent_category_id) {
    query.set("parent_category_id", String(params.parent_category_id));
  }
  if (params.category_id) query.set("category_id", String(params.category_id));
  if (params.number_of_stages) {
    query.set("number_of_stages", String(params.number_of_stages));
  }
  if (params.governorate_id) {
    query.set("governorate_id", String(params.governorate_id));
  }

  if (
    params.min_price != null &&
    params.min_price !== "" &&
    Number(params.min_price) > PRICE_MIN
  ) {
    query.set("min_price", String(params.min_price));
  }

  if (
    params.max_price != null &&
    params.max_price !== "" &&
    Number(params.max_price) < PRICE_MAX
  ) {
    query.set("max_price", String(params.max_price));
  }

  if (params.page != null && Number(params.page) > 1) {
    query.set("page", String(params.page));
  }

  if (
    params.per_page != null &&
    Number(params.per_page) !== PRODUCTS_PER_PAGE
  ) {
    query.set("per_page", String(params.per_page));
  }

  const qs = query.toString();
  return qs ? `/products?${qs}` : "/products";
}
