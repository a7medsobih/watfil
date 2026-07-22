import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Package } from "lucide-react";

import AppPagination from "@/components/common/AppPagination";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/common/ProductCard";
import { getCategories } from "@/features/categories/api";
import { getGovernorates } from "@/features/companies/api";
import ProductsFilters from "@/features/products/components/ProductsFilters";
import ProductsFiltersSheet from "@/features/products/components/ProductsFiltersSheet";
import ProductsSearch from "@/features/products/components/ProductsSearch";
import { getProducts } from "@/features/products/api";
import {
  buildProductsHref,
  resolveProductsParams,
} from "@/features/products/utils/resolve-products-params";

export default async function Page({ searchParams }) {
  const locale = await getLocale();
  const t = await getTranslations();
  const params = resolveProductsParams(await searchParams);

  const [categories, governorates, { products, meta }] = await Promise.all([
    getCategories(),
    getGovernorates({ locale }),
    getProducts(params),
  ]);

  const filterLabels = {
    filters: t("products.filters"),
    category: t("products.category"),
    price: t("products.price"),
    governorate: t("products.governorate"),
    all: t("products.all"),
    allGovernorates: t("products.allGovernorates"),
    reset: t("products.resetFilters"),
  };

  const currency = locale === "ar" ? "ج.م" : "EGP";

  return (
    <>
      <PageHeader
        title={t("products.title")}
        subtitle={t("products.count", { count: meta.total })}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.products") },
        ]}
        actions={
          <Suspense fallback={null}>
            <ProductsSearch placeholder={t("products.searchPlaceholder")} />
          </Suspense>
        }
      />

      <section className="container pb-16 pt-2 sm:pt-4">
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <p className="text-sm text-muted-foreground">
            {t("products.count", { count: meta.total })}
          </p>
          <Suspense fallback={null}>
            <ProductsFiltersSheet
              categories={categories}
              governorates={governorates}
              labels={filterLabels}
              currency={currency}
            />
          </Suspense>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <Suspense fallback={null}>
              <ProductsFilters
                categories={categories}
                governorates={governorates}
                labels={filterLabels}
                currency={currency}
              />
            </Suspense>
          </div>

          <div>
            {products.length > 0 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                    />
                  ))}
                </div>

                <AppPagination
                  currentPage={meta.currentPage}
                  lastPage={meta.lastPage}
                  total={meta.total}
                  perPage={meta.perPage}
                  labels={{
                    previous: t("pagination.previous"),
                    next: t("pagination.next"),
                  }}
                  hrefBuilder={(page) =>
                    buildProductsHref({
                      ...params,
                      page,
                    })
                  }
                />
              </>
            ) : (
              <EmptyState
                icon={<Package className="size-7 sm:size-8" aria-hidden />}
                title={t("products.emptyTitle")}
                description={t("products.empty")}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
