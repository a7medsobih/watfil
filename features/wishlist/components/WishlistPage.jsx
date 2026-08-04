"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Building2, Heart, Package } from "lucide-react";

import AppPagination from "@/components/common/AppPagination";
import CompanyCard from "@/components/common/CompanyCard";
import EmptyState from "@/components/common/EmptyState";
import ProductCard from "@/components/common/ProductCard";
import {
  CompanyCardSkeletonGrid,
} from "@/components/skeletons/CompanyCardSkeleton";
import {
  ProductCardSkeletonGrid,
} from "@/components/skeletons/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/features/auth";
import { getCustomerLikes } from "@/features/wishlist/api";
import { buildProductLikeKeyFromProduct } from "@/features/wishlist/types";
import { Link } from "@/i18n/navigation";
import { useAuthStore, useIsAuthenticated } from "@/stores/auth-store";
import { useLikesStore } from "@/stores/likes-store";
import { cn } from "@/lib/utils";

const EMPTY_META = { total: 0, currentPage: 1, lastPage: 1, perPage: 12 };

/** Stable identity for a liked product row (prevents catalog/company id collisions). */
function productRowKey(product) {
  return (
    buildProductLikeKeyFromProduct(product) ??
    `${product?.likeSource ?? product?.source ?? "unknown"}-${product?.companyId ?? "x"}-${product?.id}`
  );
}

function normalizeInitial(initialData, productsPerPage, companiesPerPage) {
  return {
    products: initialData?.products ?? [],
    companies: initialData?.companies ?? [],
    productsMeta: {
      ...EMPTY_META,
      perPage: productsPerPage,
      ...(initialData?.meta?.products ?? {}),
    },
    companiesMeta: {
      ...EMPTY_META,
      perPage: companiesPerPage,
      ...(initialData?.meta?.companies ?? {}),
    },
  };
}

/**
 * Wishlist rebuilt on GET /customer/likes.
 * Tabs: Products | Companies — independent pagination.
 */
export default function WishlistPage({
  initialData = null,
  initialAuthenticated = false,
  productsPerPage = 12,
  companiesPerPage = 12,
}) {
  const t = useTranslations("wishlist");
  const tNav = useTranslations("nav");
  const tPagination = useTranslations("pagination");
  const locale = useLocale();
  const isAuthenticated = useIsAuthenticated();
  const isAuthHydrated = useAuthStore((state) => state.isHydrated);
  const token = useAuthStore((state) => state.token);
  const { openLogin } = useRequireAuth("login");
  const setProductLiked = useLikesStore((state) => state.setProductLiked);
  const setCompanyLiked = useLikesStore((state) => state.setCompanyLiked);

  const seeded = normalizeInitial(
    initialData,
    productsPerPage,
    companiesPerPage,
  );

  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState(seeded.products);
  const [companies, setCompanies] = useState(seeded.companies);
  const [productsMeta, setProductsMeta] = useState(seeded.productsMeta);
  const [companiesMeta, setCompaniesMeta] = useState(seeded.companiesMeta);
  const [productsPage, setProductsPage] = useState(
    seeded.productsMeta.currentPage || 1,
  );
  const [companiesPage, setCompaniesPage] = useState(
    seeded.companiesMeta.currentPage || 1,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const removedProductsRef = useRef(new Map());
  const removedCompaniesRef = useRef(new Map());
  const skipInitialFetchRef = useRef(Boolean(initialData));

  const loadPage = useCallback(
    async ({
      nextProductsPage = productsPage,
      nextCompaniesPage = companiesPage,
    } = {}) => {
      if (!token) {
        setProducts([]);
        setCompanies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getCustomerLikes(
          token,
          {
            products_page: nextProductsPage,
            products_per_page: productsPerPage,
            companies_page: nextCompaniesPage,
            companies_per_page: companiesPerPage,
          },
          locale,
        );

        removedProductsRef.current.clear();
        removedCompaniesRef.current.clear();
        setProducts(result.products);
        setCompanies(result.companies);
        setProductsMeta(result.meta.products);
        setCompaniesMeta(result.meta.companies);
        setProductsPage(result.meta.products.currentPage || nextProductsPage);
        setCompaniesPage(result.meta.companies.currentPage || nextCompaniesPage);

        for (const product of result.products) {
          const key = buildProductLikeKeyFromProduct(product);
          if (key) setProductLiked(key, true);
        }
        for (const company of result.companies) {
          if (company?.id != null) setCompanyLiked(company.id, true);
        }
      } catch {
        setError(t("loadError"));
      } finally {
        setLoading(false);
      }
    },
    [
      token,
      locale,
      productsPage,
      companiesPage,
      productsPerPage,
      companiesPerPage,
      t,
      setProductLiked,
      setCompanyLiked,
    ],
  );

  useEffect(() => {
    if (!isAuthHydrated) return;

    if (!isAuthenticated) {
      setProducts([]);
      setCompanies([]);
      setLoading(false);
      return;
    }

    if (skipInitialFetchRef.current) {
      skipInitialFetchRef.current = false;
      for (const product of seeded.products) {
        const key = buildProductLikeKeyFromProduct(product);
        if (key) setProductLiked(key, true);
      }
      for (const company of seeded.companies) {
        if (company?.id != null) setCompanyLiked(company.id, true);
      }
      return;
    }

    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-fetch when auth settles / token changes
  }, [isAuthHydrated, isAuthenticated, token]);

  const handleProductsPageChange = (page) => {
    setProductsPage(page);
    loadPage({ nextProductsPage: page, nextCompaniesPage: companiesPage });
  };

  const handleCompaniesPageChange = (page) => {
    setCompaniesPage(page);
    loadPage({ nextProductsPage: productsPage, nextCompaniesPage: page });
  };

  const handleProductLikeChange = (product) => (next) => {
    const key = productRowKey(product);

    if (!next.liked) {
      removedProductsRef.current.set(key, product);
      setProducts((current) =>
        current.filter((entry) => productRowKey(entry) !== key),
      );
      setProductsMeta((meta) => ({
        ...meta,
        total: Math.max(0, (meta.total || 0) - 1),
      }));
      return;
    }

    const stashed = removedProductsRef.current.get(key);
    if (!stashed) return;

    removedProductsRef.current.delete(key);
    setProducts((current) =>
      current.some((entry) => productRowKey(entry) === key)
        ? current
        : [...current, stashed],
    );
    setProductsMeta((meta) => ({
      ...meta,
      total: (meta.total || 0) + 1,
    }));
  };

  const handleCompanyLikeChange = (company) => (next) => {
    if (!next.liked) {
      removedCompaniesRef.current.set(company.id, company);
      setCompanies((current) =>
        current.filter((entry) => String(entry.id) !== String(company.id)),
      );
      setCompaniesMeta((meta) => ({
        ...meta,
        total: Math.max(0, (meta.total || 0) - 1),
      }));
      return;
    }

    const stashed = removedCompaniesRef.current.get(company.id);
    if (!stashed) return;

    removedCompaniesRef.current.delete(company.id);
    setCompanies((current) =>
      current.some((entry) => String(entry.id) === String(company.id))
        ? current
        : [...current, stashed],
    );
    setCompaniesMeta((meta) => ({
      ...meta,
      total: (meta.total || 0) + 1,
    }));
  };

  const showAuthGate =
    isAuthHydrated && !isAuthenticated && !initialAuthenticated;
  const showInitialLoading = !isAuthHydrated && !initialData;

  if (showInitialLoading) {
    return tab === "companies" ? (
      <CompanyCardSkeletonGrid count={6} />
    ) : (
      <ProductCardSkeletonGrid count={8} />
    );
  }

  if (showAuthGate) {
    return (
      <EmptyState
        icon={<Heart className="size-7 sm:size-8" aria-hidden />}
        title={t("loginRequiredTitle")}
        description={t("loginRequiredDescription")}
        action={
          <Button type="button" onClick={openLogin}>
            {tNav("login")}
          </Button>
        }
      />
    );
  }

  if (error && !products.length && !companies.length) {
    return (
      <EmptyState
        icon={<Package className="size-7 sm:size-8" aria-hidden />}
        title={t("loadError")}
        description={t("loadErrorDescription")}
        action={
          <Button type="button" variant="outline" onClick={() => loadPage()}>
            {t("retry")}
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div
          role="tablist"
          aria-label={t("title")}
          className="flex h-auto flex-wrap gap-1.5 rounded-full bg-muted p-1.5"
        >
          {[
            {
              key: "products",
              label: t("tabs.products"),
              count: productsMeta.total ?? products.length,
            },
            {
              key: "companies",
              label: t("tabs.companies"),
              count: companiesMeta.total ?? companies.length,
            },
          ].map((item) => {
            const isActive = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(item.key)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                <span className="ms-2 tabular-nums text-muted-foreground">
                  ({item.count})
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          tab === "companies" ? (
            <CompanyCardSkeletonGrid count={6} />
          ) : (
            <ProductCardSkeletonGrid count={8} />
          )
        ) : tab === "products" ? (
          products.length > 0 ? (
            <>
              <div className="grid gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={productRowKey(product)}
                    product={product}
                    locale={locale}
                    variant={
                      product.likeSource === "company" ||
                        product.source === "company"
                        ? "company"
                        : "catalog"
                    }
                    companyId={product.companyId ?? null}
                    onLikeChange={handleProductLikeChange(product)}
                  />
                ))}
              </div>
              <AppPagination
                currentPage={productsMeta.currentPage || productsPage}
                lastPage={productsMeta.lastPage || 1}
                total={productsMeta.total}
                perPage={productsMeta.perPage || productsPerPage}
                onPageChange={handleProductsPageChange}
                labels={{
                  previous: tPagination("previous"),
                  next: tPagination("next"),
                }}
              />
            </>
          ) : (
            <EmptyState
              icon={<Heart className="size-7 sm:size-8" aria-hidden />}
              title={t("emptyTitle")}
              description={t("empty")}
              action={
                <Button type="button" asChild>
                  <Link href="/products">{t("emptyProductsCta")}</Link>
                </Button>
              }
            />
          )
        ) : companies.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onLikeChange={handleCompanyLikeChange(company)}
                />
              ))}
            </div>
            <AppPagination
              currentPage={companiesMeta.currentPage || companiesPage}
              lastPage={companiesMeta.lastPage || 1}
              total={companiesMeta.total}
              perPage={companiesMeta.perPage || companiesPerPage}
              onPageChange={handleCompaniesPageChange}
              labels={{
                previous: tPagination("previous"),
                next: tPagination("next"),
              }}
            />
          </>
        ) : (
          <EmptyState
            icon={<Building2 className="size-7 sm:size-8" aria-hidden />}
            title={t("emptyCompaniesTitle")}
            description={t("emptyCompanies")}
            action={
              <Button type="button" asChild>
                <Link href="/companies">{t("emptyCompaniesCta")}</Link>
              </Button>
            }
          />
        )}
      </div>
    </>
  );
}
