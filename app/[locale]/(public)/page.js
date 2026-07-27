import { getTranslations } from "next-intl/server";

import DownloadAppPromo from "@/components/common/DownloadAppPromo";
import JoinCompanyCTA from "@/features/companies/components/JoinCompanyCTA";
import {
  BlogSection,
  CategoriesSection,
  CompaniesSection,
  HeroSection,
  ProductsSection,
  StatsSection,
  WhySection,
} from "@/features/home";

export default async function Page() {
  const t = await getTranslations("joinUs");

  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ProductsSection />
      <StatsSection />
      <CompaniesSection />
      <WhySection />
      <BlogSection />
      <DownloadAppPromo placement="home" />
      <JoinCompanyCTA
        title={t("cta.home.title")}
        description={t("cta.home.description")}
        actionLabel={t("actions.joinNow")}
      />
    </>
  );
}
