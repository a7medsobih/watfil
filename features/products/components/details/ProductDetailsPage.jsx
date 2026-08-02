import { Suspense } from "react";

import AppBreadcrumb from "@/components/common/AppBreadcrumb";
import ProductDetailsViewClient from "@/features/products/components/details/ProductDetailsViewClient";
import ProductOfferingCompanies from "@/features/products/components/details/ProductOfferingCompanies";
import PersonalizedProductLike, {
  ProductLikeFallback,
} from "@/features/products/components/details/PersonalizedProductLike";
import SimilarProductsSection, {
  SimilarProductsSkeleton,
} from "@/features/products/components/details/SimilarProductsSection";
import { LIKE_SOURCE } from "@/features/wishlist/types";

/**
 * Composes the public catalog product detail page.
 * Primary content (name / price / description) is rendered via ProductHero,
 * which is a client component with SSR enabled (present in initial HTML).
 */
export default function ProductDetailsPage({
  product,
  locale = "ar",
  breadcrumbs = [],
  company = null,
  showOfferingCompanies = true,
  offerings = [],
  governorates = [],
  selectedGovernorateId,
  companiesLabels = {},
}) {
  if (!product) return null;

  const mode = company || !showOfferingCompanies ? "company" : "catalog";
  const likeSource =
    product.likeSource ??
    product.source ??
    (product.companyId != null ? LIKE_SOURCE.COMPANY : LIKE_SOURCE.CATALOG);
  const likeCompanyId =
    likeSource === LIKE_SOURCE.COMPANY
      ? (product.companyId ?? company?.id ?? null)
      : null;

  return (
    <div className="container pb-16 pt-4 md:pt-8">
      {breadcrumbs.length > 0 && (
        <div className="mb-6 md:mb-8">
          <AppBreadcrumb items={breadcrumbs} />
        </div>
      )}

      <ProductDetailsViewClient
        product={product}
        company={company}
        offerings={offerings}
        locale={locale}
        mode={mode}
        showOfferingCompanies={showOfferingCompanies}
        likeSlot={
          <Suspense fallback={<ProductLikeFallback className="size-10" />}>
            <PersonalizedProductLike
              productId={product.id}
              source={likeSource}
              companyId={likeCompanyId}
              likesCount={product.likesCount ?? 0}
              className="size-10"
            />
          </Suspense>
        }
      />

      {showOfferingCompanies && (
        <ProductOfferingCompanies
          productId={product.id}
          offerings={offerings}
          governorates={governorates}
          selectedGovernorateId={selectedGovernorateId}
          locale={locale}
          labels={companiesLabels}
        />
      )}

      <Suspense fallback={<SimilarProductsSkeleton locale={locale} />}>
        <SimilarProductsSection
          mode="catalog"
          productId={product.id}
          companyId={offerings[0]?.company?.id ?? null}
          governorateId={selectedGovernorateId}
          locale={locale}
        />
      </Suspense>
    </div>
  );
}
