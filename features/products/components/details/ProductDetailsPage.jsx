import AppBreadcrumb from "@/components/common/AppBreadcrumb";
import ProductDetailsTabs from "@/features/products/components/details/ProductDetailsTabs";
import ProductHero from "@/features/products/components/details/ProductHero";
import ProductOfferingCompanies from "@/features/products/components/details/ProductOfferingCompanies";

/**
 * Composes the public product detail page (catalog or company offer).
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

  return (
    <div className="container pb-16 pt-4 md:pt-8">
      {breadcrumbs.length > 0 && (
        <div className="mb-6 md:mb-8">
          <AppBreadcrumb items={breadcrumbs} />
        </div>
      )}

      <ProductHero
        product={product}
        locale={locale}
        company={company}
        showOfferingCompanies={showOfferingCompanies}
      />
      <ProductDetailsTabs product={product} locale={locale} />

      {showOfferingCompanies && (
        <ProductOfferingCompanies
          productSlug={product.slug}
          offerings={offerings}
          governorates={governorates}
          selectedGovernorateId={selectedGovernorateId}
          locale={locale}
          labels={companiesLabels}
        />
      )}
    </div>
  );
}
