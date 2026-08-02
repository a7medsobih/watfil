import { getTranslations } from "next-intl/server";

import PageHeader from "@/components/common/PageHeader";
import { RecentlyViewedPage } from "@/features/browsing";

export default async function Page() {
  const t = await getTranslations();

  return (
    <>
      <PageHeader
        title={t("browsing.pageTitle")}
        subtitle={t("browsing.pageSubtitle")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.recent") },
        ]}
      />

      <section className="container pb-16 pt-2 sm:pt-4">
        <RecentlyViewedPage />
      </section>
    </>
  );
}
