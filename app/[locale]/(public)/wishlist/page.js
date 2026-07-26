import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import PageHeader from "@/components/common/PageHeader";
import { WishlistPage } from "@/features/wishlist";

export default async function Page() {
  const t = await getTranslations();

  return (
    <>
      <PageHeader
        title={t("wishlist.title")}
        subtitle={t("wishlist.subtitle")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.wishlist") },
        ]}
      />

      <section className="container pb-16 pt-2 sm:pt-4">
        <Suspense fallback={null}>
          <WishlistPage />
        </Suspense>
      </section>
    </>
  );
}
