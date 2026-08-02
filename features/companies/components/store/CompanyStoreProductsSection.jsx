"use client";

import { Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Package } from "lucide-react";

import AppPagination from "@/components/common/AppPagination";
import EmptyState from "@/components/common/EmptyState";
import ProductCard from "@/components/common/ProductCard";
import { ProductCardSkeletonGrid } from "@/components/skeletons/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ListQueryProvider } from "@/features/products/context/list-query-context";
import ProductsActiveFilters from "@/features/products/components/ProductsActiveFilters";
import ProductsFilters from "@/features/products/components/ProductsFilters";
import ProductsFiltersSheet from "@/features/products/components/ProductsFiltersSheet";
import ProductsSearch from "@/features/products/components/ProductsSearch";
import { useCompanyStoreQuery } from "@/features/companies/hooks/use-company-store-query";
import { hasActiveCompanyStoreFilters } from "@/features/companies/utils/resolve-company-store-params";

/**
 * Company store products — same UX as /products, scoped to one company.
 * Filters/search/pagination are URL-driven and resolved on the server.
 */
export default function CompanyStoreProductsSection({
  companyId,
  products = [],
  meta = { total: 0, currentPage: 1, lastPage: 1, perPage: 15 },
  storeParams = {},
  productTypes = [],
  parentCategories = [],
  childCategories = [],
}) {
  const t = useTranslations();
  const locale = useLocale();
  const query = useCompanyStoreQuery({ companyId, productTypes });
  const { isPending } = query;

  const hasFilters = hasActiveCompanyStoreFilters(storeParams);

  const filterLabels = {
    filters: t("products.filters"),
    productType: t("products.productType"),
    parentCategory: t("products.parentCategory"),
    category: t("products.category"),
    stages: t("products.stages"),
    price: t("products.price"),
    source: t("products.source"),
    sourceCatalog: t("products.sourceCatalog"),
    sourceCompany: t("products.sourceCompany"),
    all: t("products.all"),
    reset: t("products.resetFilters"),
  };

  const activeFilterLabels = {
    ...filterLabels,
    search: t("products.search"),
    clearAll: t("products.clearAll"),
    removeFilter: t("products.removeFilter"),
  };

  return (
    <ListQueryProvider value={query}>
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              {t("company.tabs.store")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("products.count", { count: meta.total })}
            </p>
          </div>

          <Suspense
            fallback={<Skeleton className="h-11 w-full max-w-md rounded-full" />}
          >
            <ProductsSearch
              placeholder={t("products.searchPlaceholder")}
              className="max-w-md"
            />
          </Suspense>
        </div>

        <div className="flex items-center justify-between gap-3 lg:hidden">
          <p className="text-sm text-muted-foreground">
            {t("products.count", { count: meta.total })}
          </p>
          <Suspense fallback={<Skeleton className="h-10 w-36 rounded-xl" />}>
            <ProductsFiltersSheet
              productTypes={productTypes}
              parentCategories={parentCategories}
              childCategories={childCategories}
              governorates={[]}
              labels={filterLabels}
              locale={locale}
              showStagesFilter
              showGovernorateFilter={false}
              showSourceFilter
            />
          </Suspense>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <Suspense
              fallback={<Skeleton className="h-[420px] w-full rounded-3xl" />}
            >
              <ProductsFilters
                productTypes={productTypes}
                parentCategories={parentCategories}
                childCategories={childCategories}
                governorates={[]}
                labels={filterLabels}
                locale={locale}
                showStagesFilter
                showGovernorateFilter={false}
                showSourceFilter
              />
            </Suspense>
          </div>

          <div>
            <Suspense fallback={null}>
              <ProductsActiveFilters
                productTypes={productTypes}
                parentCategories={parentCategories}
                childCategories={childCategories}
                governorates={[]}
                labels={activeFilterLabels}
                locale={locale}
              />
            </Suspense>

            {isPending ? (
              <ProductCardSkeletonGrid
                count={meta.perPage || 15}
                className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
              />
            ) : products.length > 0 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard
                      key={`${product.source ?? "product"}-${product.id}-${product.sku ?? ""}`}
                      product={product}
                      locale={locale}
                      variant="company"
                      companyId={companyId}
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
                  onPageChange={(page) =>
                    query.update({ page }, { resetPage: false })
                  }
                />
              </>
            ) : (
              <EmptyState
                icon={<Package className="size-7 sm:size-8" aria-hidden />}
                title={t("company.emptyProductsTitle")}
                description={
                  hasFilters
                    ? t("products.empty")
                    : t("company.emptyProducts")
                }
                action={
                  hasFilters ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => query.reset()}
                    >
                      {t("products.resetFilters")}
                    </Button>
                  ) : null
                }
              />
            )}
          </div>
        </div>
      </section>
    </ListQueryProvider>
  );
}
