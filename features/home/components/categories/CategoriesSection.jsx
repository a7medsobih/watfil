import {
  Droplets,
  Factory,
  FlaskConical,
  Home,
  Sun,
  Wrench,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import SectionHeader from "@/components/common/SectionHeader";
import { categories } from "@/features/home/data/categories";

import CategoryCard from "./CategoryCard";

const iconMap = {
  home: Home,
  factory: Factory,
  droplets: Droplets,
  sun: Sun,
  flask: FlaskConical,
  wrench: Wrench,
};

export default async function CategoriesSection() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <section className="container py-10">
      <SectionHeader
        eyebrow={locale === "ar" ? "الفئات" : "Categories"}
        title={t("home.categories.title")}
        subtitle={t("home.categories.subtitle")}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? Droplets;

          return (
            <CategoryCard
              key={cat.id}
              name={cat.name[locale] ?? cat.name.en}
              count={cat.count}
              Icon={Icon}
            />
          );
        })}
      </div>
    </section>
  );
}
