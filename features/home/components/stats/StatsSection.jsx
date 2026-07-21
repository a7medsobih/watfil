import { getTranslations } from "next-intl/server";

import { getStatistics } from "@/features/home/api";

import StatsCard from "./StatsCard";

export default async function StatsSection() {
  const t = await getTranslations();
  const stats = await getStatistics();

  const items = [
    {
      value: stats.productsCount,
      label: t("home.stats.products"),
    },
    {
      value: stats.companiesCount,
      label: t("home.stats.companies"),
    },
    {
      value: stats.verifiedRatingsCount,
      label: t("home.stats.reviews"),
    },
    {
      value: stats.governoratesCount,
      label: t("home.stats.governorates"),
    },
  ];

  return (
    <section className="gradient-hero py-16 md:py-20">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {items.map((item) => (
            <StatsCard key={item.label} value={item.value} label={item.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
