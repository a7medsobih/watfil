import { cache } from "react";

import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { getCustomerTokenFromCookies } from "@/lib/auth/customer-token";
import { mapCompanyDetail } from "@/features/companies/services/company.mapper";
import { resolveCompanyIdFromParam } from "@/features/companies/utils/company-slug";

/**
 * Fetches a public company store by route slug or id.
 * Route slugs are `{name}-{id}`; the API still resolves by numeric id.
 * Forwards customer token when present for `is_liked` / `my_rating` / product likes.
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

  const token = await getCustomerTokenFromCookies();

  try {
    const response = await fetcher(endpoints.companies.detail(companyId), {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      ...(token
        ? { cache: "no-store" }
        : {
            next: {
              revalidate: revalidate.medium,
              tags: [cacheTags.companies],
            },
          }),
    });

    const payload = response?.data ?? response;
    return mapCompanyDetail(payload, locale);
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
});
