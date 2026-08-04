"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";

import { getCompareProducts } from "@/features/compare/api";
import { useAuthStore } from "@/stores/auth-store";
import { useCompareStore } from "@/stores/compare-store";

/**
 * Loads compare API data when the local list has exactly 2 product ids.
 */
export function useCompareProducts() {
  const locale = useLocale();
  const token = useAuthStore((state) => state.token);
  const isAuthHydrated = useAuthStore((state) => state.isHydrated);
  const items = useCompareStore((state) => state.items);
  const hasHydrated = useCompareStore((state) => state.hasHydrated);
  const remove = useCompareStore((state) => state.remove);
  const clear = useCompareStore((state) => state.clear);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const ids = useMemo(
    () => items.map((entry) => Number(entry.id)).filter(Boolean),
    [items],
  );
  const idsKey = ids.join(",");
  const ready = hasHydrated && isAuthHydrated && ids.length === 2;

  const reload = useCallback(async () => {
    if (!ready) {
      setProducts([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const currentIds = idsKey.split(",").map(Number);
    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);

    try {
      const next = await getCompareProducts(currentIds, {
        token: token || null,
        locale,
      });
      if (currentRequest !== requestId.current) return;
      setProducts(next);
    } catch (err) {
      if (currentRequest !== requestId.current) return;
      setProducts([]);
      setError(err);
    } finally {
      if (currentRequest === requestId.current) {
        setIsLoading(false);
      }
    }
  }, [ready, idsKey, token, locale]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    items,
    ids,
    products,
    isLoading,
    error,
    ready,
    hasHydrated: hasHydrated && isAuthHydrated,
    reload,
    remove,
    clear,
  };
}
