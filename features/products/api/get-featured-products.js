import { getProducts } from "./get-products";

/**
 * Featured products for the home page.
 * Backend-paginated — first page only, capped to `limit` so the home page
 * never downloads or renders more cards than it shows.
 *
 * @param {{ limit?: number }} [options]
 */
export async function getFeaturedProducts({ limit = 8 } = {}) {
  const { products, meta } = await getProducts({
    page: 1,
    per_page: limit,
  });

  return { products: products.slice(0, limit), meta };
}
