import { cache } from "react";

import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, companyTag, revalidate } from "@/lib/cache";
import { mapCompanyDetail } from "@/features/companies/services/company.mapper";
import { resolveCompanyIdFromParam } from "@/features/companies/utils/company-slug";

/**
 * Fetches a public company store by route slug or id.
 * Always cached — does not read cookies so the page shell stays ISR-friendly.
 * Use `getCompanyPersonalization` inside Suspense for `is_liked` / `my_rating`.
 *
 * @param {string|number} slugOrId
 * @param {string} [locale]
 */
export const getCompany = cache(async function getCompany(
  slugOrId,
  locale = "ar",
) {
  if (slugOrId == null || slugOrId === "") return null;

  const companyId = resolveCompanyIdFromParam(slugOrId);
  if (!companyId) return null;

  try {
    const response = await fetchFromAPI(endpoints.companies.detail(companyId), {
      revalidate: revalidate.medium,
      tags: [
        cacheTags.companies,
        companyTag(slugOrId),
        companyTag(companyId),
      ],
    });

    const payload = response?.data ?? response;
    return mapCompanyDetail(payload, locale);
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
});
