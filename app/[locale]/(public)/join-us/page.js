import { getLocale, getTranslations } from "next-intl/server";

import PageHeader from "@/components/common/PageHeader";
import { getGovernorates } from "@/features/companies/api";
import JoinUsPage from "@/features/companies/components/join/JoinUsPage";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations("joinUs");

  return buildMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/join-us",
    locale,
  });
}

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations();
  const governorates = await getGovernorates({ locale });

  return (
    <>
      <PageHeader
        title={t("joinUs.title")}
        subtitle={t("joinUs.subtitle")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.joinUs") },
        ]}
      />
      <JoinUsPage governorates={governorates} />
    </>
  );
}
