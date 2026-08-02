import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Package } from "lucide-react";

import AppPagination from "@/components/common/AppPagination";
import DownloadAppPromo from "@/components/common/DownloadAppPromo";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/common/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  collectStageOptions,
  DEFAULT_FILTER_STAGES,
  hasActiveProductFilters,
} from "@/features/filters";
import { getGovernorates } from "@/features/companies/api";
import {
  getGovernoratePreferenceFromCookies,
  isGovernorateAll,
  needsGovernorateUrlSeed,
  pickGovernorateId,
} from "@/features/governorate";
import ProductsActiveFilters from "@/features/products/components/ProductsActiveFilters";
import ProductsFilters from "@/features/products/components/ProductsFilters";
import ProductsFiltersSheet from "@/features/products/components/ProductsFiltersSheet";
import ProductsSearch from "@/features/products/components/ProductsSearch";
import { getProducts } from "@/features/products/api";
import {
  buildProductsHref,
  resolveProductsParams,
} from "@/features/products/utils/resolve-products-params";
import {
  getChildCategories,
  getParentCategories,
  getProductTypes,
  isFiltersProductType,
} from "@/features/taxonomy";
import { Link, redirect as i18nRedirect } from "@/i18n/navigation";

function attachTaxonomyDisplay(products, { parentCategories = [], productTypes = [] } = {}) {
  const parentsById = new Map(
    parentCategories.map((category) => [String(category.id), category.name]),
  );
  const typesById = new Map(
    productTypes.map((type) => [String(type.id), type]),
  );

  return products.map((product) => {
    const typeFromLookup = typesById.get(String(product.productTypeId));
    const productType =
      typeFromLookup &&
      (!product.productType?.label ||
        product.productType.label === product.productTypeKey)
        ? typeFromLookup
        : product.productType;

    return {
      ...product,
      productType: productType ?? product.productType,
      parentCategoryName:
        product.parentCategoryName ??
        parentsById.get(String(product.parentCategoryId)) ??
        null,
    };
  });
}

export default async function Page({ searchParams }) {
  const locale = await getLocale();
  const t = await getTranslations();
  const resolvedSearchParams = await searchParams;
  const params = resolveProductsParams(resolvedSearchParams);

  const [productTypes, governorates, preferredId] = await Promise.all([
    getProductTypes({ locale }),
    getGovernorates({ locale }),
    getGovernoratePreferenceFromCookies(),
  ]);

  // Proxy seeds missing governorate_id; this corrects invalid ids only.
  // Cookie "all" keeps the list unscoped (explicit user choice).
  const selectedGovernorateId = isGovernorateAll(preferredId) && !params.governorate_id
    ? null
    : pickGovernorateId({
        rawId: params.governorate_id,
        governorates,
        preferredId,
        allowAll: true,
      });

  if (
    needsGovernorateUrlSeed({
      rawId: params.governorate_id,
      selectedId: selectedGovernorateId,
      allowAll: true,
    })
  ) {
    i18nRedirect({
      href: buildProductsHref({
        ...params,
        governorate_id: selectedGovernorateId,
      }),
      locale,
    });
  }

  const listParams = {
    ...params,
    governorate_id: selectedGovernorateId,
  };

  const selectedType = productTypes.find(
    (type) => String(type.id) === String(listParams.product_type_id),
  );

  const [parentCategories, childCategories, { products: rawProducts, meta }] =
    await Promise.all([
      listParams.product_type_id
        ? getParentCategories(listParams.product_type_id, { locale })
        : Promise.resolve([]),
      listParams.parent_category_id
        ? getChildCategories(listParams.parent_category_id, {
            locale,
            product_type_id: listParams.product_type_id,
          })
        : Promise.resolve([]),
      getProducts(listParams),
    ]);

  const products = attachTaxonomyDisplay(rawProducts, {
    parentCategories,
    productTypes,
  });

  const stageOptions = isFiltersProductType(selectedType)
    ? (() => {
        const stages = collectStageOptions(parentCategories, childCategories);
        return stages.length > 0 ? stages : [...DEFAULT_FILTER_STAGES];
      })()
    : [];

  const hasFilters = hasActiveProductFilters(listParams);
  const catalogGovernorateId =
    selectedGovernorateId ?? governorates[0]?.id ?? null;

  const filterLabels = {
    filters: t("products.filters"),
    productType: t("products.productType"),
    parentCategory: t("products.parentCategory"),
    category: t("products.category"),
    stages: t("products.stages"),
    price: t("products.price"),
    governorate: t("products.governorate"),
    governorateHint: t("products.governorateHint"),
    allGovernorates: t("products.allGovernorates"),
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
    <>
      <PageHeader
        title={t("products.title")}
        subtitle={t("products.subtitle")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.products") },
        ]}
        actions={
          <Suspense
            fallback={<Skeleton className="h-11 w-full max-w-md rounded-full" />}
          >
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
              productTypes={productTypes}
              parentCategories={parentCategories}
              childCategories={childCategories}
              governorates={governorates}
              stageOptions={stageOptions}
              labels={filterLabels}
              locale={locale}
            />
          </Suspense>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <Suspense
              fallback={<Skeleton className="h-[420px] w-full rounded-3xl" />}
            >
              <ProductsFilters
                productTypes={productTypes}
                parentCategories={parentCategories}
                childCategories={childCategories}
                governorates={governorates}
                stageOptions={stageOptions}
                labels={filterLabels}
                locale={locale}
              />
            </Suspense>
          </div>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="hidden text-sm text-muted-foreground lg:block">
                {t("products.count", { count: meta.total })}
              </p>
            </div>

            <Suspense fallback={null}>
              <ProductsActiveFilters
                productTypes={productTypes}
                parentCategories={parentCategories}
                childCategories={childCategories}
                governorates={governorates}
                labels={activeFilterLabels}
                locale={locale}
              />
            </Suspense>

            {products.length > 0 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      variant="catalog"
                      governorate={catalogGovernorateId}
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
                      ...listParams,
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
                action={
                  hasFilters ? (
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

      <section className="pb-10">
        <DownloadAppPromo placement="products" />
      </section>
    </>
  );
}
