import { Package } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ProductCardSkeletonGrid } from "@/components/skeletons";
import EmptyState from "@/components/common/EmptyState";
import ProductCard from "@/components/common/ProductCard";
import LazySectionCarousel from "@/components/common/LazySectionCarousel";
import SectionHeader from "@/components/common/SectionHeader";
import { getCompanySimilarProducts } from "@/features/companies/api";
import { getSimilarProducts } from "@/features/products/api";

/**
 * Loading placeholder for SimilarProductsSection (Suspense fallback).
 */
export function SimilarProductsSkeleton({ locale = "ar" }) {
  const title =
    locale === "ar" ? "منتجات مشابهة" : "Related products";

  return (
    <section className="mt-12 sm:mt-16" aria-busy="true" aria-label={title}>
      <div className="mb-6 md:mb-8">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted md:h-9 md:w-64" />
      </div>
      <ProductCardSkeletonGrid
        count={4}
        className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      />
    </section>
  );
}

/**
 * Reusable similar-products block for catalog + company product detail pages.
 * Picks the correct public endpoint from `mode` — never mixes the two flows.
 *
 * @param {object} props
 * @param {"catalog"|"company"} props.mode
 * @param {string|number} props.productId Supplier product id (catalog) or company product id (company)
 * @param {string|number|null} [props.governorateId] Company similar API only
 * @param {string|number|null} [props.companyId] Optional boost for catalog similar API
 * @param {string|null} [props.companySlug] For company ProductCard links
 * @param {"catalog"|"company"} [props.source] Company similar API source param
 * @param {string} [props.locale]
 */
export default async function SimilarProductsSection({
  mode = "catalog",
  productId,
  governorateId = null,
  companyId = null,
  companySlug = null,
  source = "company",
  locale = "ar",
}) {
  const t = await getTranslations("product");
  const isCompanyMode = mode === "company";

  const title = isCompanyMode ? t("relatedFromCompany") : t("related");

  let products = [];

  if (isCompanyMode) {
    if (companyId == null || companyId === "" || productId == null) {
      products = [];
    } else {
      const result = await getCompanySimilarProducts(companyId, {
        productId,
        source,
        governorateId,
        locale,
      });
      products = result.products;
    }
  } else if (productId != null && productId !== "") {
    const result = await getSimilarProducts(productId, {
      companyId,
      page: 1,
      perPage: 15,
      locale,
    });
    products = result.products.filter(
      (item) => String(item.id) !== String(productId),
    );
  }

  const cardVariant = isCompanyMode ? "company" : "catalog";

  return (
    <section className="mt-12 sm:mt-16">
      <SectionHeader title={title} className="mb-6 md:mb-8" />

      {!products.length ? (
        <EmptyState
          title={t("relatedEmptyTitle")}
          description={t("relatedEmpty")}
          icon={<Package className="size-7 sm:size-8" aria-hidden />}
        />
      ) : (
        <LazySectionCarousel keepCarousel ariaLabel={title}>
          {products.map((product) => (
            <ProductCard
              key={`${product.source ?? cardVariant}-${product.id}`}
              product={product}
              locale={locale}
              variant={cardVariant}
              companySlug={isCompanyMode ? companySlug : null}
              className="h-full"
            />
          ))}
        </LazySectionCarousel>
      )}
    </section>
  );
}
