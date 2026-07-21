import { getProducts } from "./get-products";

/**
 * Featured products for the home page.
 * Uses backend pagination — first page, 12 items only.
 */
export async function getFeaturedProducts() {
  return getProducts({
    page: 1,
    per_page: 12,
  });
}
