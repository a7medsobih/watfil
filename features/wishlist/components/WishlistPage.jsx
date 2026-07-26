"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Building2, Heart, Loader2Icon, Package } from "lucide-react";

import CampanyCard from "@/components/common/CampanyCard";
import EmptyState from "@/components/common/EmptyState";
import ProductCard from "@/components/common/ProductCard";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/features/auth";
import { getLikedProducts } from "@/features/wishlist/api";
import { useAuthStore, useIsAuthenticated } from "@/stores/auth-store";
import { useLikedCompaniesStore } from "@/stores/liked-companies-store";
import { useWishlistCountStore } from "@/stores/wishlist-count-store";
import { cn } from "@/lib/utils";

/**
 * Wishlist with Products | Companies sections.
 */
export default function WishlistPage() {
  const t = useTranslations("wishlist");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const isAuthenticated = useIsAuthenticated();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const token = useAuthStore((state) => state.token);
  const { openLogin } = useRequireAuth("login");
  const setWishlistCount = useWishlistCountStore((state) => state.setCount);
  const likedCompanies = useLikedCompaniesStore((state) => state.items);
  const removeLikedCompany = useLikedCompaniesStore((state) => state.remove);

  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const removedRef = useRef(new Map());

  const loadProducts = useCallback(async () => {
    if (!token) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getLikedProducts(token);
      removedRef.current.clear();
      setProducts(result.products);
      const total = result?.meta?.total;
      setWishlistCount(
        total != null ? total : (result?.products?.length ?? 0),
      );
    } catch {
      setError(t("loadError"));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [token, t, setWishlistCount]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      setProducts([]);
      setLoading(false);
      return;
    }

    loadProducts();
  }, [isHydrated, isAuthenticated, loadProducts]);

  const handleLikeChange = (product) => (next) => {
    if (!next.liked) {
      removedRef.current.set(product.id, product);
      setProducts((current) =>
        current.filter((entry) => entry.id !== product.id),
      );
      return;
    }

    const stashed = removedRef.current.get(product.id);
    if (!stashed) return;

    removedRef.current.delete(product.id);
    setProducts((current) =>
      current.some((entry) => entry.id === product.id)
        ? current
        : [...current, stashed],
    );
  };

  if (!isHydrated || loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-16">
        <Loader2Icon
          className="size-8 animate-spin text-primary"
          aria-hidden
        />
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  }

  if (!isAuthenticated) {
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

  if (error) {
    return (
      <EmptyState
        icon={<Package className="size-7 sm:size-8" aria-hidden />}
        title={t("loadError")}
        description={t("loadErrorDescription")}
        action={
          <Button type="button" variant="outline" onClick={loadProducts}>
            {t("retry")}
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label={t("title")}
        className="flex h-auto flex-wrap gap-1.5 rounded-full bg-muted p-1.5"
      >
        {[
          { key: "products", label: t("tabs.products"), count: products.length },
          {
            key: "companies",
            label: t("tabs.companies"),
            count: likedCompanies.length,
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

      {tab === "products" ? (
        products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={`${product.likeSource}-${product.companyId ?? "catalog"}-${product.id}`}
                product={product}
                locale={locale}
                variant={
                  product.likeSource === "company" || product.source === "company"
                    ? "company"
                    : "catalog"
                }
                companySlug={product.companySlug ?? null}
                onLikeChange={handleLikeChange(product)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Heart className="size-7 sm:size-8" aria-hidden />}
            title={t("emptyTitle")}
            description={t("empty")}
          />
        )
      ) : likedCompanies.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {likedCompanies.map((company) => (
            <div key={company.id} className="relative">
              <CampanyCard company={company} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute end-3 top-3 z-[2] bg-card/90 backdrop-blur-sm"
                onClick={() => removeLikedCompany(company.id)}
              >
                {t("unlike")}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Building2 className="size-7 sm:size-8" aria-hidden />}
          title={t("emptyCompaniesTitle")}
          description={t("emptyCompanies")}
        />
      )}
    </div>
  );
}
