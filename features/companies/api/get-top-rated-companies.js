import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import {
  mapCompanies,
  mapCompaniesMeta,
} from "@/features/companies/services/company.mapper";

/**
 * Fetches top-rated public companies.
 * GET /public/companies/top-rated
 *
 * Supports optional governorate (omit = all governorates), pagination, and search.
 * Sorted by rating on the backend (same source as the home teaser).
 *
 * Never throws: callers can keep rendering on failure.
 *
 * @param {{
 *   limit?: number|null,
 *   min_ratings?: number,
 *   governorate_id?: string|number|null,
 *   page?: number|string,
 *   per_page?: number|string,
 *   search?: string|null,
 *   locale?: string,
 * }} [options]
 * @returns {Promise<{ companies: object[], meta: object }>}
 */
export async function getTopRatedCompanies({
  limit = null,
  min_ratings = 1,
  governorate_id = null,
  page = null,
  per_page = null,
  search = null,
  locale = "ar",
} = {}) {
  try {
    const params = {
      min_ratings,
    };

    if (limit != null && limit !== "") {
      params.limit = limit;
    }

    if (page != null && page !== "") {
      params.page = page;
    }

    if (per_page != null && per_page !== "") {
      params.per_page = per_page;
    } else if (limit == null && page != null) {
      params.per_page = 15;
    }

    if (governorate_id != null && governorate_id !== "") {
      params.governorate_id = governorate_id;
    }

    if (search != null && search !== "") {
      params.search = search;
    }

    const isSearch = Boolean(search);

    const response = await fetchFromAPI(endpoints.companies.topRated, {
      params,
      ...(isSearch
        ? { cache: "no-store" }
        : {
            revalidate: revalidate.medium,
            tags: [cacheTags.companies],
          }),
    });

    const rows = response?.data ?? response ?? [];
    const companies = mapCompanies(Array.isArray(rows) ? rows : [], locale);
    const meta = mapCompaniesMeta(response?.meta);

    // When API returns a plain list (home teaser), synthesize a single-page meta.
    if (!response?.meta && companies.length) {
      const size = Number(limit ?? per_page ?? companies.length) || companies.length;
      return {
        companies,
        meta: {
          total: companies.length,
          currentPage: 1,
          lastPage: 1,
          perPage: size,
        },
      };
    }

    return { companies, meta };
  } catch {
    return {
      companies: [],
      meta: {
        total: 0,
        currentPage: 1,
        lastPage: 1,
        perPage: Number(per_page ?? limit ?? 15) || 15,
      },
    };
  }
}
