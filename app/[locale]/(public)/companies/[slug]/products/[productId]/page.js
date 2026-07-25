import { getLocale, getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import {
  getCompany,
  getCompanyProductDetails,
} from "@/features/companies/api";
import { CompanyBrandSetter } from "@/features/companies/context/company-brand-context";
import {
  buildCompanyProductHref,
  resolveCompanyProductSource,
} from "@/features/companies/utils/resolve-company-product-params";
import ProductDetailsPage from "@/features/products/components/details/ProductDetailsPage";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params, searchParams }) {
  const { slug, productId } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = await getLocale();
  const source = resolveCompanyProductSource(resolvedSearchParams);

  const [company, product] = await Promise.all([
    getCompany(slug, locale),
    getCompanyProductDetails({
      companySlugOrId: slug,
      productId,
      source,
      locale,
    }),
  ]);

  if (!product) {
    return buildMetadata({
      title: "Product",
      path: `/companies/${slug}/products/${productId}`,
      locale,
    });
  }

  return buildMetadata({
    title: company ? `${product.name} · ${company.name}` : product.name,
    description: product.description || undefined,
    path: buildCompanyProductHref(company?.slug ?? slug, product.id, {
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
  const { slug, productId } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations();
  const source = resolveCompanyProductSource(resolvedSearchParams);

  const company = await getCompany(slug, locale);
  if (!company) notFound();

  const incomingSlug = decodeURIComponent(String(slug));
  if (incomingSlug !== company.slug) {
    redirect(
      `/${locale}${buildCompanyProductHref(company.slug, productId, { source })}`,
    );
  }

  const product = await getCompanyProductDetails({
    companySlugOrId: company.id,
    productId,
    source,
    locale,
  });

  if (!product) notFound();

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
      <ProductDetailsPage
        product={product}
        locale={locale}
        company={company}
        showOfferingCompanies={false}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.companies"), href: "/companies" },
          { label: company.name, href: `/companies/${company.slug}` },
          { label: product.name },
        ]}
      />
    </>
  );
}
