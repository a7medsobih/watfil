import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import ProductCard from "@/components/common/ProductCard";
import LazySectionCarousel from "@/components/common/LazySectionCarousel";
import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { getGovernorates } from "@/features/companies/api";
import { getFeaturedProducts } from "@/features/products/api";
import { Link } from "@/i18n/navigation";

const HOME_PRODUCTS_LIMIT = 8;

export default async function ProductsSection() {
  const t = await getTranslations();
  const locale = await getLocale();
  const [{ products }, governorates] = await Promise.all([
    getFeaturedProducts({
      limit: HOME_PRODUCTS_LIMIT,
    }),
    getGovernorates({ locale }),
  ]);

  if (!products.length) return null;

  const catalogGovernorateId = governorates[0]?.id ?? null;

  return (
    <section className="container py-10">
      <SectionHeader
        eyebrow={locale === "ar" ? "مختارة لك" : "Featured for you"}
        title={t("home.featured.title")}
        subtitle={t("home.featured.subtitle")}
        actions={
          <Button variant="outline" className="text-xs md:text-sm" asChild>
            <Link href="/products" className="group">
              {t("cta.viewAll")}{" "}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </Button>
        }
      />

      <LazySectionCarousel ariaLabel={t("home.featured.title")}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            variant="catalog"
            governorate={catalogGovernorateId}
            className="h-full"
          />
        ))}
      </LazySectionCarousel>
    </section>
  );
}
