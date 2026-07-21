"use client";

import {
  ArrowRight,
  Droplets,
  Factory,
  FlaskConical,
  Home,
  Sun,
  Wrench,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { categories } from "@/features/home/data/categories";
import { Link } from "@/i18n/navigation";

import CategoryCard from "./CategoryCard";

const iconMap = {
  home: Home,
  factory: Factory,
  droplets: Droplets,
  sun: Sun,
  flask: FlaskConical,
  wrench: Wrench,
};

export default function CategoriesSection() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="container py-16">
      <SectionHeader
        eyebrow={locale === "ar" ? "الفئات" : "Categories"}
        title={t("home.categories.title")}
        subtitle={t("home.categories.subtitle")}
        actions={
          <Button variant="outline" className="text-xs md:text-sm" asChild>
            <Link href="/products" className="group">
              {t("cta.viewAll")}{" "}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? Droplets;

          return (
            <CategoryCard
              key={cat.id}
              href="/products"
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
