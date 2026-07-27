import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";

import OrderSuccessPage from "@/features/checkout/components/OrderSuccessPage";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations("orderSuccess");

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/checkout/success",
    locale,
  });
}

export default function OrderSuccessRoute() {
  return (
    <Suspense
      fallback={
        <div className="container py-16">
          <div className="mx-auto h-48 max-w-3xl animate-pulse rounded-3xl bg-muted" />
        </div>
      }
    >
      <OrderSuccessPage />
    </Suspense>
  );
}
