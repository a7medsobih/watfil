import { getLocale, getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import {
  getCompany,
  getCompanyProducts,
} from "@/features/companies/api";
import { CompanyBrandSetter } from "@/features/companies/context/company-brand-context";
import CompanyStorePage from "@/features/companies/components/store/CompanyStorePage";
import { buildMetadata } from "@/lib/seo/metadata";

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

  const { products, meta } = await getCompanyProducts(company.id, {
    page,
    per_page: 15,
    locale,
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
        productsMeta={meta}
        paginationLabels={{
          previous: t("pagination.previous"),
          next: t("pagination.next"),
        }}
      />
    </>
  );
}
