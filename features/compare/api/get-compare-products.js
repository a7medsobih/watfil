import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";
import { mapProducts } from "@/features/products/services/product.mapper";

/**
 * Normalize and validate exactly two distinct catalog product ids.
 * @param {Array<string|number>} productIds
 * @returns {number[]}
 */
export function normalizeCompareIds(productIds = []) {
  const ids = [];
  const seen = new Set();

  for (const raw of productIds) {
    const id = Number(raw);
    if (!Number.isFinite(id) || id <= 0) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }

  return ids;
}

/**
 * Compare two Watfil catalog products side-by-side.
 * Guest → GET /public/products/compare
 * Customer → GET /customer/products/compare (includes accurate is_liked)
 *
 * @param {Array<string|number>} productIds - must resolve to exactly 2 distinct ids
 * @param {{ token?: string|null, locale?: string }} [options]
 * @returns {Promise<object[]>} Mapped products in the same order as the ids sent
 */
export async function getCompareProducts(
  productIds,
  { token = null, locale = "ar" } = {},
) {
  const ids = normalizeCompareIds(productIds);
  if (ids.length !== 2) {
    const error = new Error("Compare requires exactly 2 distinct product ids");
    error.status = 422;
    throw error;
  }

  const path = token
    ? endpoints.products.customerCompare
    : endpoints.products.compare;

  const response = await fetchFromAPI(path, {
    token: token || undefined,
    cache: "no-store",
    params: { "product_ids[]": ids },
  });

  const products = response?.data?.products ?? [];
  return mapProducts(Array.isArray(products) ? products : [], locale);
}
