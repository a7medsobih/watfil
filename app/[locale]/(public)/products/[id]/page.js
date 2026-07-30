import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getGovernorates } from "@/features/companies/api";
import {
  getGovernoratePreferenceFromCookies,
  needsGovernorateUrlSeed,
  pickGovernorateId,
} from "@/features/governorate";
import {
  getProduct,
  getProductCompanies,
  getProducts,
} from "@/features/products/api";
import ProductDetailsPage from "@/features/products/components/details/ProductDetailsPage";
import {
  buildCatalogProductHref,
  resolveProductDetailParams,
} from "@/features/products/utils/resolve-product-detail-params";
import { redirect as i18nRedirect } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo/metadata";

/** ISR: product details refresh every 5 minutes. */
export const revalidate = 300;

/**
 * Pre-render top products by id; remaining via on-demand ISR.
 */
export async function generateStaticParams() {
  try {
    const { products } = await getProducts({ page: 1, per_page: 50 });
    return (products || [])
      .map((product) => product.id)
      .filter((id) => id != null && id !== "")
      .map((id) => ({ id: String(id) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const locale = await getLocale();
  const product = await getProduct(id, locale);

  if (!product) {
    return buildMetadata({
      title: "Product",
      path: `/products/${id}`,
      locale,
    });
  }

  return buildMetadata({
    title: product.name,
    description: product.description || undefined,
    path: `/products/${product.id}`,
    locale,
    images: product.image ? [{ url: product.image }] : undefined,
  });
}

export default async function ProductDetailRoute({ params, searchParams }) {
  const { id } = await params;
  const locale = await getLocale();
  const t = await getTranslations();
  const resolvedSearchParams = await searchParams;

  const product = await getProduct(id, locale);
  if (!product) notFound();

  const [governorates, preferredId] = await Promise.all([
    getGovernorates({ locale }),
    getGovernoratePreferenceFromCookies(),
  ]);

  const rawGovernorate = (() => {
    const value = resolvedSearchParams?.governorate;
    return Array.isArray(value) ? value[0] : value;
  })();

  const detailParams = resolveProductDetailParams(resolvedSearchParams);
  const selectedGovernorateId = pickGovernorateId({
    rawId: detailParams.governorate_id ?? rawGovernorate,
    governorates,
    preferredId,
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
      href: buildCatalogProductHref(product.id, {
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
