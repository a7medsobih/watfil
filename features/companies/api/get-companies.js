import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import {
  mapCompanies,
  mapCompaniesMeta,
} from "@/features/companies/services/company.mapper";

/**
 * Builds API query params for companies list.
 * governorate_id is optional — omit for all governorates when backend allows.
 * @param {object} params
 */
function buildQueryParams(params = {}) {
  const query = {
    page: params.page ?? 1,
    per_page: params.per_page ?? 15,
  };

  if (params.governorate_id != null && params.governorate_id !== "") {
    query.governorate_id = params.governorate_id;
  }

  if (params.search != null && params.search !== "") {
    query.search = params.search;
  }

  return query;
}

/**
 * Fetches paginated public companies.
 * governorate_id is optional (all governorates when omitted).
 * Search queries are never cached.
 *
 * @param {object} params
 * @param {string|number} [params.governorate_id]
 * @param {string} [params.locale]
 * @returns {Promise<{ companies: object[], meta: object }>}
 */
export async function getCompanies(params = {}) {
  const isSearch = Boolean(params.search);

  const response = await fetchFromAPI(endpoints.companies.list, {
    params: buildQueryParams(params),
    ...(isSearch
      ? { cache: "no-store" }
      : {
          revalidate: revalidate.medium,
          tags: [cacheTags.companies],
        }),
  });

  return {
    companies: mapCompanies(response?.data ?? [], params.locale),
    meta: mapCompaniesMeta(response?.meta),
  };
}
