import { mapCompany } from "@/features/companies/services/company.mapper";
import { mapProduct } from "@/features/products/services/product.mapper";
import { normalizeProductSource } from "@/features/browsing/types";

/**
 * Maps a recent-product browsing row to a UI model.
 *
 * @param {object} item
 * @param {string} [locale]
 */
export function mapRecentProduct(item, locale = "ar") {
  if (!item) return null;

  const companyRaw = item.company ?? null;
  const productRaw = item.product ?? item;
  const product = mapProduct(productRaw);
  if (!product) return null;

  const company = companyRaw
    ? mapCompany(companyRaw, locale) ?? {
        id: companyRaw.id ?? null,
        name: companyRaw.name ?? "",
        logo: companyRaw.logo ?? null,
        hasLogo: Boolean(companyRaw.logo),
      }
    : null;

  const source = normalizeProductSource(
    productRaw.source ?? item.source ?? product.source,
  );

  const companyId =
    company?.id ??
    item.company_id ??
    productRaw.company_id ??
    product.companyId ??
    null;

  return {
    company,
    companyId,
    product: {
      ...product,
      source,
      companyId,
      viewsCount: Number(
        productRaw.views_count ?? product.viewsCount ?? 0,
      ),
      cashPrice: Number(
        productRaw.cash_price ?? product.cashPrice ?? 0,
      ),
    },
    lastViewedAt: item.last_viewed_at ?? item.lastViewedAt ?? null,
  };
}

export function mapRecentProducts(items = [], locale = "ar") {
  return items.map((item) => mapRecentProduct(item, locale)).filter(Boolean);
}
