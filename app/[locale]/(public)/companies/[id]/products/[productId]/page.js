import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import {
  getCompany,
  getCompanyProductDetails,
  getGovernorates,
} from "@/features/companies/api";
import { CompanyBrandSetter } from "@/features/companies/context/company-brand-context";
import {
  buildCompanyProductHref,
  resolveCompanyProductGovernorate,
  resolveCompanyProductSource,
} from "@/features/companies/utils/resolve-company-product-params";
import {
  getGovernoratePreferenceFromCookies,
  needsGovernorateUrlSeed,
  pickGovernorateId,
} from "@/features/governorate";
import CompanyOfferDetailsPage from "@/features/products/components/details/CompanyOfferDetailsPage";
import SimilarProductsSection, {
  SimilarProductsSkeleton,
} from "@/features/products/components/details/SimilarProductsSection";
import { EXPERIENCE } from "@/features/experience/constants";
import {
  buildCompanyExperienceHref,
  resolveExperience,
} from "@/features/experience/utils";
import { redirect as i18nRedirect } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params, searchParams }) {
  const { id, productId } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = await getLocale();
  const source = resolveCompanyProductSource(resolvedSearchParams);

  const [company, product] = await Promise.all([
    getCompany(id, locale),
    getCompanyProductDetails({
      companyId: id,
      productId,
      source,
      locale,
    }),
  ]);

  if (!product) {
    return buildMetadata({
      title: "Product",
      path: `/companies/${id}/products/${productId}`,
      locale,
    });
  }

  return buildMetadata({
    title: company ? `${product.name} · ${company.name}` : product.name,
    description: product.description || undefined,
    path: buildCompanyProductHref(company?.id ?? id, product.id, {
      source,
    }),
    locale,
    images: product.image ? [{ url: product.image }] : undefined,
  });
}

export default async function CompanyProductDetailsRoute({
  params,
  searchParams,
}) {
  const { id, productId } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations();
  const source = resolveCompanyProductSource(resolvedSearchParams);
  const experience = resolveExperience(resolvedSearchParams);
  const isCampaign = experience === EXPERIENCE.CAMPAIGN;

  const company = await getCompany(id, locale);
  if (!company) notFound();

  const product = await getCompanyProductDetails({
    companyId: company.id,
    productId,
    source,
    locale,
  });

  if (!product) notFound();

  const [governorates, preferredId] = await Promise.all([
    getGovernorates({ locale }),
    getGovernoratePreferenceFromCookies(),
  ]);

  const rawGovernorate = resolveCompanyProductGovernorate(resolvedSearchParams);
  const selectedGovernorateId = pickGovernorateId({
    rawId: rawGovernorate,
    governorates,
    preferredId:
      preferredId ??
      company.governorate?.id ??
      company.coverage?.items?.[0]?.id ??
      null,
    allowAll: false,
  });

  if (
    needsGovernorateUrlSeed({
      rawId: rawGovernorate,
      selectedId: selectedGovernorateId,
      allowAll: false,
    })
  ) {
    i18nRedirect({
      href: buildCompanyProductHref(company.id, productId, {
        source,
        experience: isCampaign ? EXPERIENCE.CAMPAIGN : undefined,
        governorate: selectedGovernorateId,
      }),
      locale,
    });
  }

  const governorateId = selectedGovernorateId;

  return (
    <>
      <CompanyBrandSetter
        brand={{
          id: String(company.id),
          name: company.name,
          logo: company.logo,
          hasLogo: company.hasLogo,
        }}
      />
      <CompanyOfferDetailsPage
        product={product}
        company={company}
        locale={locale}
        breadcrumbs={
          isCampaign
            ? [
                {
                  label: company.name,
                  href: buildCompanyExperienceHref(
                    company.id,
                    EXPERIENCE.CAMPAIGN,
                  ),
                },
                { label: product.name },
              ]
            : [
                { label: t("nav.home"), href: "/" },
                { label: t("nav.companies"), href: "/companies" },
                { label: company.name, href: `/companies/${company.id}` },
                { label: product.name },
              ]
        }
      >
        <Suspense fallback={<SimilarProductsSkeleton locale={locale} />}>
          <SimilarProductsSection
            mode="company"
            productId={productId}
            companyId={company.id}
            governorateId={governorateId}
            source={source}
            locale={locale}
          />
        </Suspense>
      </CompanyOfferDetailsPage>
    </>
  );
}
