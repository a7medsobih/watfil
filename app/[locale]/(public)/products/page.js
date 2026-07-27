import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Package } from "lucide-react";

import AppPagination from "@/components/common/AppPagination";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/common/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
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
import DownloadAppPromo from "@/components/common/DownloadAppPromo";

export default async function Page({ searchParams }) {
  const locale = await getLocale();
  const t = await getTranslations();
  const params = resolveProductsParams(await searchParams);

  const [categories, governorates, { products, meta }] = await Promise.all([
    getCategories(),
    getGovernorates({ locale }),
    getProducts({
      ...params,
      min_price: null,
      max_price: null,
    }),
  ]);

  const hasActiveFilters = Boolean(
    params.search || params.category_id || params.governorate_id,
  );

  const filterLabels = {
    filters: t("products.filters"),
    category: t("products.category"),
    governorate: t("products.governorate"),
    governorateHint: t("products.governorateHint"),
    allGovernorates: t("products.allGovernorates"),
    all: t("products.all"),
    reset: t("products.resetFilters"),
  };

  return (
    <>
      <PageHeader
        title={t("products.title")}
        subtitle={t("products.subtitle")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.products") },
        ]}
        actions={
          <Suspense fallback={<Skeleton className="h-11 w-full max-w-md rounded-full" />}>
            <ProductsSearch placeholder={t("products.searchPlaceholder")} />
          </Suspense>
        }
      />

      <section className="container py-10 pt-2 sm:pt-4">
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <p className="text-sm text-muted-foreground">
            {t("products.count", { count: meta.total })}
          </p>
          <Suspense fallback={<Skeleton className="h-10 w-36 rounded-xl" />}>
            <ProductsFiltersSheet
              categories={categories}
              governorates={governorates}
              labels={filterLabels}
            />
          </Suspense>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <Suspense
              fallback={<Skeleton className="h-[420px] w-full rounded-3xl" />}
            >
              <ProductsFilters
                categories={categories}
                governorates={governorates}
                labels={filterLabels}
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
                      variant="catalog"
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
                      search: params.search,
                      category_id: params.category_id,
                      governorate_id: params.governorate_id,
                      page,
                      per_page: params.per_page,
                    })
                  }
                />
              </>
            ) : (
              <EmptyState
                icon={<Package className="size-7 sm:size-8" aria-hidden />}
                title={t("products.emptyTitle")}
                description={t("products.empty")}
                action={
                  hasActiveFilters ? (
                    <Button variant="outline" asChild>
                      <Link href="/products">{t("products.resetFilters")}</Link>
                    </Button>
                  ) : null
                }
              />
            )}
          </div>
        </div>
      </section>
      <section className="pb-10 ">
        <DownloadAppPromo placement="products" />
      </section>

    </>
  );
}
