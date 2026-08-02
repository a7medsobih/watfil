import { mapCompany } from "@/features/companies/services/company.mapper";

/**
 * Maps a recent-store browsing row to a UI model.
 *
 * @param {object} item
 * @param {string} [locale]
 */
export function mapRecentStore(item, locale = "ar") {
  if (!item) return null;

  const companyRaw = item.company ?? item;
  const company = mapCompany(companyRaw, locale);
  if (!company) return null;

  return {
    company: {
      ...company,
      viewsCount: Number(
        companyRaw.views_count ?? company.viewsCount ?? 0,
      ),
    },
    lastVisitedAt: item.last_visited_at ?? item.lastVisitedAt ?? null,
  };
}

export function mapRecentStores(items = [], locale = "ar") {
  return items.map((item) => mapRecentStore(item, locale)).filter(Boolean);
}
