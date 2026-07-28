import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import {
  getCompany,
  getCompanyBillboards,
  getCompanyProducts,
  getTopRatedCompanies,
} from "@/features/companies/api";
import { CompanyBrandSetter } from "@/features/companies/context/company-brand-context";
import CompanyStorePage from "@/features/companies/components/store/CompanyStorePage";
import PersonalizedCompanyActions, {
  CompanyLikeFallback,
} from "@/features/companies/components/store/PersonalizedCompanyActions";
import { buildHeroSlides } from "@/features/companies/utils/build-hero-slides";
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

function readPage(searchParams) {
  const value = searchParams?.page;
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw ?? 1);
  return Number.isFinite(page) && page > 0 ? page : 1;
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

export default async function CompanyStoreRoute({ params, searchParams }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations();
  const resolvedSearchParams = await searchParams;
  const page = readPage(resolvedSearchParams);

  const company = await getCompany(slug, locale);

  if (!company) notFound();

  const incoming = decodeURIComponent(String(slug));
  if (incoming !== company.slug) {
    const qs = page > 1 ? `?page=${page}` : "";
    redirect(`/${locale}/companies/${encodeURIComponent(company.slug)}${qs}`);
  }

  // Billboards only after company profile succeeded; failures → [].
  const [billboards, { products, meta }] = await Promise.all([
    getCompanyBillboards(company.id),
    getCompanyProducts(company.id, {
      page,
      per_page: 15,
      locale,
    }),
  ]);

  const heroSlides = buildHeroSlides({
    billboards,
    gallery: company.gallery,
  });

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
        company={{
          ...company,
          products,
          productsCount: meta.total || company.productsCount,
        }}
        heroSlides={heroSlides}
        productsMeta={meta}
        paginationLabels={{
          previous: t("pagination.previous"),
          next: t("pagination.next"),
        }}
        likeSlot={
          <Suspense fallback={<CompanyLikeFallback />}>
            <PersonalizedCompanyActions
              slugOrId={company.slug}
              company={company}
            />
          </Suspense>
        }
      />
    </>
  );
}
