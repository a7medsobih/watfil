import { getLocale, getTranslations } from "next-intl/server";

import { getGovernorates } from "@/features/companies/api";
import CheckoutPage from "@/features/checkout/components/CheckoutPage";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations("checkout");

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/checkout",
    locale,
  });
}

export default async function CheckoutRoute() {
  const locale = await getLocale();
  const t = await getTranslations();
  const governorates = await getGovernorates({ locale });

  return (
    <CheckoutPage
      governorates={governorates}
      breadcrumbs={[
        { label: t("nav.home"), href: "/" },
        { label: t("checkout.title") },
      ]}
    />
  );
}
