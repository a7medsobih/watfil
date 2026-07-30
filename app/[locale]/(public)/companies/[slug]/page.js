// src/app/[locale]/(public)/companies/[slug]/page.js
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { ProductCardSkeletonGrid } from "@/components/skeletons/ProductCardSkeleton";
import {
  getCompany,
  getCompanyBillboards,
  getCompanyProducts,
  getGovernorates,
  getTopRatedCompanies,
} from "@/features/companies/api";
import { CompanyBrandSetter } from "@/features/companies/context/company-brand-context";
import CompanyStorePage from "@/features/companies/components/store/CompanyStorePage";
import CompanyStoreProductsSection from "@/features/companies/components/store/CompanyStoreProductsSection";
import PersonalizedCompanyActions, {
  CompanyLikeFallback,
} from "@/features/companies/components/store/PersonalizedCompanyActions";
import { buildHeroSlides } from "@/features/companies/utils/build-hero-slides";
import {
  buildCompanyStoreHref,
  resolveCompanyStoreParams,
} from "@/features/companies/utils/resolve-company-store-params";
import { EXPERIENCE } from "@/features/experience/constants";
import {
  getChildCategories,
  getParentCategories,
  getProductTypes,
} from "@/features/taxonomy";
import { buildMetadata } from "@/lib/seo/metadata";

/** ISR: company details refresh every 5 minutes. */
export const revalidate = 300;

/**
 * Pre-render top-rated companies; remaining slugs via on-demand ISR.
 */
export async function generateStaticParams() {
  try {
    const { companies } = await getTopRatedCompanies({
      limit: 50,
      min_ratings: 1,
    });
    return (companies || [])
      .map((company) => company.slug)
      .filter(Boolean)
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locale = await getLocale();
  const company = await getCompany(slug, locale);

  if (!company) {
    return buildMetadata({
      title: "Company",
      path: `/companies/${slug}`,
      locale,
    });
  }

  return buildMetadata({
    title: company.name,
    description: company.about || undefined,
    path: `/companies/${company.slug}`,
    locale,
    images: company.hasLogo ? [{ url: company.logo }] : undefined,
  });
}

function StoreProductsSkeleton() {
  return (
    <section className="space-y-4" aria-busy="true">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-28 animate-pulse rounded bg-muted" />
      <ProductCardSkeletonGrid
        count={8}
        className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
      />
    </section>
  );
}

async function CompanyStoreProducts({
  companyId,
  companySlug,
  searchParams,
  locale,
}) {
  const storeParams = resolveCompanyStoreParams(searchParams);

  const [productTypes, { products: rawProducts, meta }] = await Promise.all([
    getProductTypes({ locale }),
    getCompanyProducts(companyId, { ...storeParams, locale }),
  ]);

  const [parentCategories, childCategories] = await Promise.all([
    storeParams.product_type_id
      ? getParentCategories(storeParams.product_type_id, { locale })
      : Promise.resolve([]),
    storeParams.parent_category_id
      ? getChildCategories(storeParams.parent_category_id, {
        locale,
        product_type_id: storeParams.product_type_id,
      })
      : Promise.resolve([]),
  ]);

  const typesById = new Map(
    productTypes.map((type) => [String(type.id), type]),
  );
  const parentsById = new Map(
    parentCategories.map((category) => [String(category.id), category.name]),
  );

  const products = rawProducts.map((product) => {
    const typeFromLookup = typesById.get(String(product.productTypeId));
    const productType =
      typeFromLookup &&
        (!product.productType?.label ||
          product.productType.label === product.productTypeKey)
        ? typeFromLookup
        : product.productType;

    return {
      ...product,
      productType: productType ?? product.productType,
      parentCategoryName:
        product.parentCategoryName ??
        parentsById.get(String(product.parentCategoryId)) ??
        null,
    };
  });

  return (
    <CompanyStoreProductsSection
      companySlug={companySlug}
      products={products}
      meta={meta}
      storeParams={storeParams}
      productTypes={productTypes}
      parentCategories={parentCategories}
      childCategories={childCategories}
    />
  );
}

export default async function CompanyStoreRoute({ params, searchParams }) {
  const { slug } = await params;
  const locale = await getLocale();
  const resolvedSearchParams = await searchParams;
  const storeParams = resolveCompanyStoreParams(resolvedSearchParams);

  const company = await getCompany(slug, locale);

  if (!company) notFound();

  const incoming = decodeURIComponent(String(slug));
  if (incoming !== company.slug) {
    redirect(`/${locale}${buildCompanyStoreHref(company.slug, storeParams)}`);
  }

  const isCampaign = storeParams.experience === EXPERIENCE.CAMPAIGN;

  // Campaign: skip billboard ads, keep company gallery as the hero.
  const [billboards, governorates] = await Promise.all([
    isCampaign ? Promise.resolve([]) : getCompanyBillboards(company.id),
    getGovernorates({ locale }),
  ]);

  const defaultGovernorateId =
    company.governorate?.id ?? governorates[0]?.id ?? null;

  const heroSlides = await buildHeroSlides({
    billboards,
    gallery: company.gallery,
    governorate: defaultGovernorateId,
    locale,
  });

  const storeKey = [
    storeParams.page,
    storeParams.per_page,
    storeParams.search,
    storeParams.product_type_id,
    storeParams.parent_category_id,
    storeParams.category_id,
    storeParams.min_price,
    storeParams.max_price,
    storeParams.source,
    storeParams.experience,
  ].join("|");

  return (
    <>
      <CompanyBrandSetter
        brand={{
          slug: company.slug,
          name: company.name,
          logo: company.logo,
          hasLogo: company.hasLogo,
        }}
      />
      <CompanyStorePage
        company={company}
        heroSlides={heroSlides}
        likeSlot={
          <Suspense fallback={<CompanyLikeFallback />}>
            <PersonalizedCompanyActions
              slugOrId={company.slug}
              company={company}
            />
          </Suspense>
        }
        storeSlot={
          <Suspense key={storeKey} fallback={<StoreProductsSkeleton />}>
            <CompanyStoreProducts
              companyId={company.id}
              companySlug={company.slug}
              searchParams={resolvedSearchParams}
              locale={locale}
            />
          </Suspense>
        }
      />
    </>
  );
}
