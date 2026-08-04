import { getTranslations } from "next-intl/server";

import PageHeader from "@/components/common/PageHeader";
import { ComparePage } from "@/features/compare";

export default async function Page() {
  const t = await getTranslations();

  return (
    <>
      <PageHeader
        title={t("compare.title")}
        subtitle={t("compare.subtitle")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.compare") },
        ]}
      />

      <section className="container pb-16 pt-2 sm:pt-4">
        <ComparePage />
      </section>
    </>
  );
}
