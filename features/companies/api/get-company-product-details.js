import { cache } from "react";

import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, companyTag, productTag, revalidate } from "@/lib/cache";
import { mapProduct } from "@/features/products/services/product.mapper";

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
    if (companyIdParam == null || companyIdParam === "") return null;
    const companyId = String(companyIdParam);
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
      if (!payload || typeof payload !== "object") {
        console.error(
          `[getCompanyProductDetails] unexpected payload company=${companyId} product=${productId}`,
          { type: typeof payload },
        );
        return null;
      }

      const product = mapProduct(payload, locale);
      if (!product?.id) return null;

      const sellingCompanyId = Number(companyId);

      const companyProductId = Number(
        payload?.company_product_id ??
          payload?.company_product?.id ??
          product.companyProductId ??
          payload?.id ??
          product.id,
      );

      console.info(
        `[getCompanyProductDetails] ok company=${companyId} product=${productId}`,
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
      if (error?.status === 404) {
        console.info(
          `[getCompanyProductDetails] not found company=${companyId} product=${productId}`,
        );
        return null;
      }
      console.error(
        `[getCompanyProductDetails] failed company=${companyId} product=${productId}`,
        {
          status: error?.status,
          code: error?.code,
          message: error?.message,
        },
      );
      throw error;
    }
  },
);
