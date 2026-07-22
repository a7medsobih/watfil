export const PRICE_MIN = 0;
export const PRICE_MAX = 8000;
export const PRICE_STEP = 100;

/**
 * Resolves products list query from Next.js searchParams.
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
    page: read("page") ?? 1,
    per_page: read("per_page") ?? 15,
    search: read("search") || null,
    category_id: read("category_id") || null,
    governorate_id: read("governorate_id") || null,
    min_price: minPrice != null && minPrice !== "" ? Number(minPrice) : null,
    max_price: maxPrice != null && maxPrice !== "" ? Number(maxPrice) : null,
  };
}

/**
 * Builds a /products href from filter state.
 * Omits default price bounds and empty values.
 *
 * @param {object} params
 */
export function buildProductsHref(params = {}) {
  const query = new URLSearchParams();

  if (params.search) query.set("search", String(params.search));
  if (params.category_id) query.set("category_id", String(params.category_id));
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

  if (params.per_page != null && Number(params.per_page) !== 15) {
    query.set("per_page", String(params.per_page));
  }

  const qs = query.toString();
  return qs ? `/products?${qs}` : "/products";
}
