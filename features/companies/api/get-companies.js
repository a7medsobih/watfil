import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import {
  mapCompanies,
  mapCompaniesMeta,
} from "@/features/companies/services/company.mapper";

/**
 * Builds API query params for companies list.
 * Ready for future: search, page, per_page, filters.
 * @param {object} params
 */
function buildQueryParams(params = {}) {
  const query = {
    governorate_id: params.governorate_id,
    page: params.page ?? 1,
    per_page: params.per_page ?? 15,
  };

  if (params.search != null && params.search !== "") {
    query.search = params.search;
  }

  return query;
}

/**
 * Fetches paginated public companies for a governorate.
 * Requires governorate_id — listing all companies is not supported by the API.
 *
 * @param {object} params
 * @param {string|number} params.governorate_id
 * @param {string} [params.locale]
 * @returns {Promise<{ companies: object[], meta: object }>}
 */
export async function getCompanies(params = {}) {
  if (params.governorate_id == null || params.governorate_id === "") {
    throw new Error("getCompanies requires governorate_id");
  }

  const response = await fetcher(endpoints.companies.list, {
    params: buildQueryParams(params),
    next: {
      revalidate: revalidate.medium,
      tags: [cacheTags.companies],
    },
  });

  return {
    companies: mapCompanies(response?.data ?? [], params.locale),
    meta: mapCompaniesMeta(response?.meta),
  };
}
