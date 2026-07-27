import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";

import { PageContentSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
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

function OrderSuccessFallback() {
  return (
    <PageContentSkeleton>
      <div className="mx-auto max-w-3xl space-y-4 rounded-3xl border border-border/60 bg-card p-8">
        <Skeleton className="mx-auto size-16 rounded-full" />
        <Skeleton className="mx-auto h-7 w-48" />
        <Skeleton className="mx-auto h-4 w-72 max-w-full" />
        <Skeleton className="mt-6 h-24 w-full rounded-2xl" />
      </div>
    </PageContentSkeleton>
  );
}

export default function OrderSuccessRoute() {
  return (
    <Suspense fallback={<OrderSuccessFallback />}>
      <OrderSuccessPage />
    </Suspense>
  );
}
