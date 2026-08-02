import { getLocale, getTranslations } from "next-intl/server";
import { Package } from "lucide-react";

import AppPagination from "@/components/common/AppPagination";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import ProductCard from "@/components/common/ProductCard";
import { Button } from "@/components/ui/button";
import { PRODUCTS_PER_PAGE } from "@/features/filters/constants";
import { getProducts } from "@/features/products/api";
import { Link } from "@/i18n/navigation";

function buildCategoryHref(slug, page = 1) {
  const base = `/categories/${encodeURIComponent(String(slug))}`;
  if (page != null && Number(page) > 1) {
    return `${base}?page=${page}`;
  }
  return base;
}

/**
 * Category detail — server-rendered name + product grid.
 * Product cards link directly to /products/{id} via ProductCard.
 */
export default async function CategoryDetailsPage({
  category,
  page = 1,
}) {
  const locale = await getLocale();
  const t = await getTranslations();

  if (!category) return null;

  const isParent =
    category.parentCategoryId == null || category.parentCategoryId === 0;

  const listParams = {
    page,
    per_page: PRODUCTS_PER_PAGE,
    ...(isParent
      ? { parent_category_id: category.id }
      : { category_id: category.id }),
  };

  const { products, meta } = await getProducts(listParams);
  const categoryPath = category.slug || category.id;

  return (
    <>
      <PageHeader
        title={category.name}
        subtitle={
          category.productType?.label
            ? category.productType.label
            : t("products.subtitle")
        }
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.products"), href: "/products" },
          { label: category.name },
        ]}
      />

      <section className="container pb-16 pt-2">
        <p className="mb-6 text-sm text-muted-foreground">
          {t("products.count", { count: meta.total })}
        </p>

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
              hrefBuilder={(nextPage) =>
                buildCategoryHref(categoryPath, nextPage)
              }
            />
          </>
        ) : (
          <EmptyState
            icon={<Package className="size-7 sm:size-8" aria-hidden />}
            title={t("products.emptyTitle")}
            description={t("products.empty")}
            action={
              <Button variant="outline" asChild>
                <Link href="/products">{t("products.resetFilters")}</Link>
              </Button>
            }
          />
        )}
      </section>
    </>
  );
}
