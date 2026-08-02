"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import AppPagination from "@/components/common/AppPagination";
import LazySectionCarousel from "@/components/common/LazySectionCarousel";
import ProductCard from "@/components/common/ProductCard";
import SectionHeader from "@/components/common/SectionHeader";
import { ProductCardSkeletonGrid } from "@/components/skeletons/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/features/products/api/get-products";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const EMPTY_META = { total: 0, currentPage: 1, lastPage: 1, perPage: 8 };

/**
 * Home featured products: carousel + backend page/per_page pagination.
 * Keeps a single row of cards at every breakpoint so the homepage scroll stays fixed.
 */
export default function HomeProductsClient({
  initialProducts = [],
  initialMeta = EMPTY_META,
  catalogGovernorateId = null,
  perPage = 8,
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [products, setProducts] = useState(initialProducts);
  const [meta, setMeta] = useState({ ...EMPTY_META, perPage, ...initialMeta });
  const [page, setPage] = useState(initialMeta.currentPage || 1);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setProducts(initialProducts);
    setMeta({ ...EMPTY_META, perPage, ...initialMeta });
    setPage(initialMeta.currentPage || 1);
  }, [initialProducts, initialMeta, perPage]);

  const handlePageChange = async (nextPage) => {
    if (nextPage === page || loading) return;

    const requestId = ++requestIdRef.current;
    setLoading(true);

    try {
      const result = await getProducts({
        page: nextPage,
        per_page: perPage,
      });
      if (requestId !== requestIdRef.current) return;

      setProducts(result.products ?? []);
      setMeta({ ...EMPTY_META, perPage, ...(result.meta ?? {}) });
      setPage(result.meta?.currentPage || nextPage);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

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

      <div className="relative" aria-busy={loading || undefined}>
        {loading && products.length === 0 ? (
          <ProductCardSkeletonGrid
            count={Math.min(perPage, 4)}
            className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          />
        ) : products.length > 0 ? (
          <div
            className={cn(
              "transition-opacity duration-200",
              loading && "opacity-50",
            )}
          >
            <LazySectionCarousel
              key={page}
              keepCarousel
              ariaLabel={t("home.featured.title")}
            >
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
          </div>
        ) : null}

        <AppPagination
          currentPage={meta.currentPage || page}
          lastPage={meta.lastPage || 1}
          total={meta.total}
          perPage={meta.perPage || perPage}
          labels={{
            previous: t("pagination.previous"),
            next: t("pagination.next"),
          }}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      </div>
    </section>
  );
}
