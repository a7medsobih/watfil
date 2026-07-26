import { getLocale, getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { getGovernorates } from "@/features/companies/api";
import {
  getProduct,
  getProductCompanies,
} from "@/features/products/api";
import ProductDetailsPage from "@/features/products/components/details/ProductDetailsPage";
import {
  buildProductDetailHref,
  resolveProductDetailParams,
} from "@/features/products/utils/resolve-product-detail-params";
import { redirect as i18nRedirect } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locale = await getLocale();
  const product = await getProduct(slug, locale);

  if (!product) {
    return buildMetadata({
      title: "Product",
      path: `/products/${slug}`,
      locale,
    });
  }

  return buildMetadata({
    title: product.name,
    description: product.description || undefined,
    path: `/products/${product.slug}`,
    locale,
    images: product.image ? [{ url: product.image }] : undefined,
  });
}

export default async function ProductDetailRoute({ params, searchParams }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations();
  const resolvedSearchParams = await searchParams;

  const product = await getProduct(slug, locale);
  if (!product) notFound();

  const incoming = decodeURIComponent(String(slug));
  if (incoming !== product.slug) {
    const qs = new URLSearchParams();
    const gov = Array.isArray(resolvedSearchParams?.governorate)
      ? resolvedSearchParams.governorate[0]
      : resolvedSearchParams?.governorate;
    if (gov) qs.set("governorate", String(gov));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    redirect(`/${locale}/products/${encodeURIComponent(product.slug)}${suffix}`);
  }

  const governorates = await getGovernorates({ locale });
  const defaultGovernorateId = governorates[0]?.id ?? null;

  const hasGovernorateParam = (() => {
    const value = resolvedSearchParams?.governorate;
    const raw = Array.isArray(value) ? value[0] : value;
    return raw != null && raw !== "";
  })();

  if (!hasGovernorateParam && defaultGovernorateId != null) {
    i18nRedirect({
      href: buildProductDetailHref(product.slug, {
        governorate: defaultGovernorateId,
      }),
      locale,
    });
  }

  const detailParams = resolveProductDetailParams(resolvedSearchParams, {
    defaultGovernorateId,
  });

  const isKnownGovernorate = governorates.some(
    (item) => String(item.id) === String(detailParams.governorate_id),
  );

  const selectedGovernorateId = isKnownGovernorate
    ? detailParams.governorate_id
    : defaultGovernorateId;

  if (
    selectedGovernorateId != null &&
    String(detailParams.governorate_id) !== String(selectedGovernorateId)
  ) {
    i18nRedirect({
      href: buildProductDetailHref(product.slug, {
        governorate: selectedGovernorateId,
      }),
      locale,
    });
  }

  const offerings = selectedGovernorateId
    ? await getProductCompanies(product.id, {
        governorateId: selectedGovernorateId,
        locale,
      })
    : [];

  return (
    <ProductDetailsPage
      product={product}
      locale={locale}
      breadcrumbs={[
        { label: t("nav.home"), href: "/" },
        { label: t("nav.products"), href: "/products" },
        { label: product.name },
      ]}
      offerings={offerings}
      governorates={governorates}
      selectedGovernorateId={selectedGovernorateId}
      companiesLabels={{
        title: t("product.chooseCompanyTitle"),
        subtitle: t("product.chooseCompanySubtitle"),
        filterByGov: t("product.filterByGov"),
        emptyTitle: t("product.companiesEmptyTitle"),
        empty: t("product.companiesEmpty"),
        verified: t("product.verified"),
        installment: t("product.badges.installment"),
        price: t("product.price"),
        buyNow: t("product.buyNow"),
        browseCompany: t("product.browseCompany"),
        buyFromCompany: t("product.buyFromCompany"),
        warranty: t("product.warranty"),
        installation: t("product.installation"),
        offers: t("product.offers"),
        serviceLocations: t("product.serviceLocations"),
      }}
    />
  );
}
