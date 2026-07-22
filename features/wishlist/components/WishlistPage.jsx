"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Loader2Icon, Package } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import ProductCard from "@/components/common/ProductCard";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/features/auth";
import { getLikedProducts } from "@/features/wishlist/api";
import { useAuthStore, useIsAuthenticated } from "@/stores/auth-store";
import { useWishlistCountStore } from "@/stores/wishlist-count-store";

/**
 * Client list of liked products (auth token lives in the browser).
 * Supports optional `source` filter for future catalog/company tabs.
 *
 * @param {{ source?: 'catalog'|'company' }} [props]
 */
export default function WishlistPage({ source } = {}) {
  const t = useTranslations("wishlist");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const isAuthenticated = useIsAuthenticated();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const token = useAuthStore((state) => state.token);
  const { openLogin } = useRequireAuth("login");
  const setWishlistCount = useWishlistCountStore((state) => state.setCount);

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
      const result = await getLikedProducts(token, {
        ...(source ? { source } : {}),
      });
      removedRef.current.clear();
      setProducts(result.products);
      if (!source) {
        const total = result?.meta?.total;
        setWishlistCount(
          total != null ? total : (result?.products?.length ?? 0),
        );
      }
    } catch {
      setError(t("loadError"));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [token, source, t, setWishlistCount]);

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

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="size-7 sm:size-8" aria-hidden />}
        title={t("emptyTitle")}
        description={t("empty")}
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={`${product.likeSource}-${product.companyId ?? "catalog"}-${product.id}`}
          product={product}
          locale={locale}
          onLikeChange={handleLikeChange(product)}
        />
      ))}
    </div>
  );
}
