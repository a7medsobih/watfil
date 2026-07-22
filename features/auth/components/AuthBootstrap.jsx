"use client";

import { useEffect } from "react";

import { getLikedProducts } from "@/features/wishlist/api";
import {
  clearCustomerTokenCookie,
  setCustomerTokenCookie,
} from "@/lib/auth/customer-token";
import { useAuthStore } from "@/stores/auth-store";
import { useWishlistCountStore } from "@/stores/wishlist-count-store";

/**
 * Marks auth store hydrated, syncs token cookie for RSC fetches,
 * refreshes /me, and seeds wishlist navbar count.
 */
export default function AuthBootstrap() {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setHydrated = useAuthStore((state) => state.setHydrated);
  const refreshMe = useAuthStore((state) => state.refreshMe);
  const setWishlistCount = useWishlistCountStore((state) => state.setCount);
  const resetWishlistCount = useWishlistCountStore((state) => state.reset);

  useEffect(() => {
    setHydrated(true);
  }, [setHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!token) {
      clearCustomerTokenCookie();
      resetWishlistCount();
      return;
    }

    setCustomerTokenCookie(token);
    refreshMe().catch(() => {});

    getLikedProducts(token)
      .then((result) => {
        const total = result?.meta?.total;
        setWishlistCount(
          total != null ? total : (result?.products?.length ?? 0),
        );
      })
      .catch(() => {});
  }, [isHydrated, token, refreshMe, setWishlistCount, resetWishlistCount]);

  return null;
}
