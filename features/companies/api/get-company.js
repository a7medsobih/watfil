import { cache } from "react";

import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, companyTag, revalidate } from "@/lib/cache";
import { mapCompanyDetail } from "@/features/companies/services/company.mapper";

/**
 * Fetches a public company store by id.
 * Always cached — does not read cookies so the page shell stays ISR-friendly.
 * Use `getCompanyPersonalization` inside Suspense for `is_liked` / `my_rating`.
 *
 * @param {string|number} id
 * @param {string} [locale]
 */
export const getCompany = cache(async function getCompany(id, locale = "ar") {
  if (id == null || id === "") return null;
  const companyId = String(id);

  try {
    const response = await fetchFromAPI(endpoints.companies.detail(companyId), {
      revalidate: revalidate.medium,
      tags: [cacheTags.companies, companyTag(companyId)],
    });

    const payload = response?.data ?? response;
    return mapCompanyDetail(payload, locale);
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
});
