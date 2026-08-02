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
    if (!payload || typeof payload !== "object") {
      console.error(`[getCompany] unexpected payload for id=${companyId}`, {
        type: typeof payload,
      });
      return null;
    }

    const mapped = mapCompanyDetail(payload, locale);
    if (!mapped?.id) {
      console.error(`[getCompany] mapper returned empty model for id=${companyId}`);
      return null;
    }

    console.info(`[getCompany] ok id=${companyId}`);
    return mapped;
  } catch (error) {
    if (error?.status === 404) {
      console.info(`[getCompany] not found id=${companyId}`);
      return null;
    }

    console.error(`[getCompany] failed id=${companyId}`, {
      status: error?.status,
      code: error?.code,
      message: error?.message,
    });
    throw error;
  }
});
