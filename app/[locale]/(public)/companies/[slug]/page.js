import { getLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { getCompany } from "@/features/companies/api";
import { CompanyBrandSetter } from "@/features/companies/context/company-brand-context";
import CompanyStorePage from "@/features/companies/components/store/CompanyStorePage";
import { buildMetadata } from "@/lib/seo/metadata";

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

export default async function CompanyStoreRoute({ params }) {
  const { slug } = await params;
  const locale = await getLocale();
  const company = await getCompany(slug, locale);

  if (!company) notFound();

  const incoming = decodeURIComponent(String(slug));
  if (incoming !== company.slug) {
    redirect(`/${locale}/companies/${encodeURIComponent(company.slug)}`);
  }

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
      <CompanyStorePage company={company} />
    </>
  );
}
