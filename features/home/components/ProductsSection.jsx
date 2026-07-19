// features/home/components/ProductsSection.jsx

import ProductCard from "@/components/common/ProductCard";
import SectionHeader from "@/components/common/SectionHeader"
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const ProductsSection = () => {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <section className="container py-16">
            <SectionHeader
                eyebrow={locale === "ar" ? "مختارة لك" : "Featured for you"}
                title={t("home.featured.title")}
                subtitle={t("home.featured.subtitle")}
                actions={
                    <Button variant="outline" asChild>
                        <Link href="/products" className="group">
                            {t("cta.viewAll")}{" "}
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                        </Link>
                    </Button>
                }
            />

            {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {featured.map((p, i) => (
                    <ProductCard key={p.slug} product={p} index={i} />
                ))}
            </div> */}
        </section>
    )
}

export default ProductsSection