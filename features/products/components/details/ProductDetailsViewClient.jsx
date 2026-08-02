"use client";

import ProductDetailsTabs from "@/features/products/components/details/ProductDetailsTabs";
import ProductHero from "@/features/products/components/details/ProductHero";
import { useProductViews } from "@/features/browsing/hooks/use-product-views";
import { normalizeProductSource } from "@/features/browsing/types";

/**
 * Resolves browsing company context for a product detail surface.
 * Company route → explicit company. Catalog route → first offering company.
 */
export function resolveProductViewCompanyId({ company = null, offerings = [] }) {
  if (company?.id != null && company.id !== "") return company.id;
  const first = offerings?.[0]?.company?.id;
  return first != null && first !== "" ? first : null;
}

export function resolveProductViewSource({ product, company = null }) {
  const raw =
    product?.source ??
    product?.likeSource ??
    (company ? "company" : "catalog");
  return normalizeProductSource(raw);
}

/**
 * Client island: records product view once + renders hero/tabs with live viewsCount.
 * Safe to receive Server Component slots via `likeSlot`.
 */
export default function ProductDetailsViewClient({
  product,
  company = null,
  offerings = [],
  locale = "ar",
  mode = "catalog",
  showOfferingCompanies = true,
  likeSlot = null,
}) {
  const companyId = resolveProductViewCompanyId({ company, offerings });
  const productSource = resolveProductViewSource({ product, company });

  const { viewsCount } = useProductViews({
    companyId,
    productId: product?.id,
    productSource,
    initialViewsCount: product?.viewsCount ?? 0,
  });

  if (!product) return null;

  const viewProduct = { ...product, viewsCount };

  return (
    <>
      <ProductHero
        product={viewProduct}
        locale={locale}
        company={company}
        showOfferingCompanies={showOfferingCompanies}
        mode={mode}
        likeSlot={likeSlot}
      />
      <ProductDetailsTabs
        product={viewProduct}
        locale={locale}
        mode={mode}
      />
    </>
  );
}
