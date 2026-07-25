import { cache } from "react";

import { fetcher } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, revalidate } from "@/lib/cache";
import { getCustomerTokenFromCookies } from "@/lib/auth/customer-token";
import { mapProduct } from "@/features/products/services/product.mapper";
import { resolveCompanyIdFromParam } from "@/features/companies/utils/company-slug";

/**
 * Fetches a company's product offering details.
 * GET /public/companies/{company_id}/product-details?source=&product_id=
 *
 * @param {object} options
 * @param {string|number} options.companySlugOrId
 * @param {string|number} options.productId
 * @param {"catalog"|"company"} [options.source]
 * @param {string} [options.locale]
 */
export const getCompanyProductDetails = cache(
  async function getCompanyProductDetails({
    companySlugOrId,
    productId,
    source = "catalog",
    locale = "ar",
  }) {
    if (companySlugOrId == null || companySlugOrId === "") return null;
    if (productId == null || productId === "") return null;

    const companyId = resolveCompanyIdFromParam(companySlugOrId);
    if (!companyId) return null;

    const token = await getCustomerTokenFromCookies();
    const resolvedSource = source === "company" ? "company" : "catalog";

    try {
      const response = await fetcher(
        endpoints.companies.productDetails(companyId),
        {
          params: {
            source: resolvedSource,
            product_id: productId,
          },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          ...(token
            ? { cache: "no-store" }
            : {
                next: {
                  revalidate: revalidate.medium,
                  tags: [cacheTags.companies, cacheTags.products],
                },
              }),
        },
      );

      const payload = response?.data ?? response;
      const product = mapProduct(payload, locale);
      if (!product) return null;

      return {
        ...product,
        source: payload?.source ?? resolvedSource,
        likeSource: payload?.source ?? resolvedSource,
        companyId:
          resolvedSource === "company"
            ? Number(companyId)
            : (product.companyId ?? null),
      };
    } catch (error) {
      if (error?.status === 404) return null;
      throw error;
    }
  },
);
