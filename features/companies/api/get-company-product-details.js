import { cache } from "react";

import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, companyTag, productTag, revalidate } from "@/lib/cache";
import { mapProduct } from "@/features/products/services/product.mapper";
import { toCompanyRouteId } from "@/features/companies/utils/company-slug";

/**
 * Fetches a company's product offering details.
 * Cached public payload — like personalization is a Suspense island on the page.
 */
export const getCompanyProductDetails = cache(
  async function getCompanyProductDetails({
    companyId: companyIdParam,
    productId,
    source = "catalog",
    locale = "ar",
  }) {
    const companyId = toCompanyRouteId(companyIdParam);
    if (!companyId) return null;
    if (productId == null || productId === "") return null;

    const resolvedSource = source === "company" ? "company" : "catalog";

    try {
      const response = await fetchFromAPI(
        endpoints.companies.productDetails(companyId),
        {
          params: {
            source: resolvedSource,
            product_id: productId,
          },
          revalidate: revalidate.medium,
          tags: [
            cacheTags.companies,
            cacheTags.products,
            companyTag(companyId),
            productTag(productId),
          ],
        },
      );

      const payload = response?.data ?? response;
      const product = mapProduct(payload, locale);
      if (!product) return null;

      const sellingCompanyId = Number(companyId);

      const companyProductId = Number(
        payload?.company_product_id ??
          payload?.company_product?.id ??
          product.companyProductId ??
          payload?.id ??
          product.id,
      );

      return {
        ...product,
        source: payload?.source ?? resolvedSource,
        likeSource: payload?.source ?? resolvedSource,
        companyId: sellingCompanyId,
        companyProductId: Number.isFinite(companyProductId)
          ? companyProductId
          : null,
      };
    } catch (error) {
      if (error?.status === 404) return null;
      throw error;
    }
  },
);
