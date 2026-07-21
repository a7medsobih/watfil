import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts } from "@/features/products/api";
import { Link } from "@/i18n/navigation";
import ProductCard from "@/components/common/ProductCard";

export default async function ProductsSection() {
  const t = await getTranslations();
  const locale = await getLocale();
  const { products } = await getFeaturedProducts();

  return (
    <section className="container py-16">
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

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
