import { Headset, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import SectionHeader from "@/components/common/SectionHeader";
import { whyItems } from "@/features/home/data/why";

import WhyCard from "./WhyCard";

const iconMap = {
  shield: ShieldCheck,
  sparkles: Sparkles,
  truck: Truck,
  headset: Headset,
};

export default async function WhySection() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <section className="container py-10">
      <SectionHeader
        align="center"
        eyebrow={locale === "ar" ? "لماذا نحن" : "Why us"}
        title={t("home.why.title")}
        subtitle={t("home.why.subtitle")}
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {whyItems.map((item, index) => {
          const Icon = iconMap[item.icon] ?? ShieldCheck;

          return (
            <WhyCard
              key={item.id}
              index={index}
              icon={Icon}
              title={item.title[locale] ?? item.title.en}
              description={item.description[locale] ?? item.description.en}
            />
          );
        })}
      </div>
    </section>
  );
}
