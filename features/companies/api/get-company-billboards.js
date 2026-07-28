import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, companyTag, revalidate } from "@/lib/cache";

/**
 * Maps a public billboard row into a stable frontend shape.
 * @param {object} item
 */
function mapBillboard(item) {
  if (!item?.image) return null;

  const supplierProductId =
    item.supplier_product_id ?? item.target?.product_id ?? null;

  return {
    id: item.id,
    image: item.image,
    sortOrder: Number(item.sort_order ?? 0),
    supplierProductId:
      supplierProductId != null && supplierProductId !== ""
        ? Number(supplierProductId) || supplierProductId
        : null,
    product: item.product
      ? {
          id: item.product.id,
          name: item.product.name ?? "",
          image: item.product.image ?? null,
          cashPrice: item.product.cash_price ?? null,
        }
      : null,
    target: item.target
      ? {
          type: item.target.type ?? null,
          productId: item.target.product_id ?? null,
          path: item.target.path ?? null,
        }
      : null,
  };
}

/**
 * Fetches active billboards for a public company store.
 * GET /public/companies/{company}/billboards
 *
 * Failures return [] so the storefront can fall back to gallery.
 *
 * @param {string|number} companyId
 * @returns {Promise<object[]>}
 */
export async function getCompanyBillboards(companyId) {
  if (companyId == null || companyId === "") return [];

  try {
    const response = await fetchFromAPI(
      endpoints.companies.billboards(companyId),
      {
        revalidate: revalidate.medium,
        tags: [cacheTags.companies, companyTag(companyId)],
      },
    );

    const rows = response?.data ?? response;
    if (!Array.isArray(rows)) return [];

    return rows
      .map(mapBillboard)
      .filter(Boolean)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return [];
  }
}
