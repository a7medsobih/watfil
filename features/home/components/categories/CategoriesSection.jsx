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
import { getCategories } from "@/features/categories/api";
import { categories as mockCategories } from "@/features/home/data/categories";

import CategoryCard from "./CategoryCard";

const iconMap = {
  home: Home,
  factory: Factory,
  droplets: Droplets,
  sun: Sun,
  flask: FlaskConical,
  wrench: Wrench,
};

const FALLBACK_ICONS = [Home, Factory, Droplets, Sun, FlaskConical, Wrench];

/**
 * Home categories — prefers live taxonomy (slug/id from API) for direct
 * /categories/[slug] links; falls back to mock teasers without invented hrefs.
 */
export default async function CategoriesSection() {
  const t = await getTranslations();
  const locale = await getLocale();

  let cards = [];

  try {
    const apiCategories = await getCategories({}, { locale });
    const roots = (apiCategories || []).filter(
      (category) =>
        category.parentCategoryId == null || category.parentCategoryId === 0,
    );
    const source = (roots.length > 0 ? roots : apiCategories).slice(0, 6);

    cards = source.map((category, index) => ({
      key: String(category.id ?? category.slug),
      name: category.name,
      Icon: FALLBACK_ICONS[index % FALLBACK_ICONS.length],
      href:
        category.slug || category.id != null
          ? `/categories/${encodeURIComponent(String(category.slug || category.id))}`
          : undefined,
    }));
  } catch {
    cards = [];
  }

  if (!cards.length) {
    cards = mockCategories.map((cat) => {
      const Icon = iconMap[cat.icon] ?? Droplets;
      return {
        key: String(cat.id),
        name: cat.name[locale] ?? cat.name.en,
        Icon,
        // Mock marketing slugs are not backend ids — link to catalog, not a fake detail.
        href: "/products",
      };
    });
  }

  return (
    <section className="container py-10">
      <SectionHeader
        eyebrow={locale === "ar" ? "حلول المياه" : "Water solutions"}
        title={t("home.categories.title")}
        subtitle={t("home.categories.subtitle")}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <CategoryCard
            key={card.key}
            name={card.name}
            Icon={card.Icon}
            href={card.href}
          />
        ))}
      </div>
    </section>
  );
}
