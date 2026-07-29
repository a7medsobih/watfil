"use client";

import { useEffect } from "react";

import { fetchAllLikedIds } from "@/features/wishlist/api";
import {
  clearCustomerTokenCookie,
  setCustomerTokenCookie,
} from "@/lib/auth/customer-token";
import { useAuthStore } from "@/stores/auth-store";
import { useLikesStore } from "@/stores/likes-store";

/**
 * Marks auth store hydrated, syncs token cookie for RSC fetches,
 * refreshes /me, and hydrates the unified likes store from GET /customer/likes.
 */
export default function AuthBootstrap() {
  const token = useAuthStore((state) => state.token);
  const isAuthHydrated = useAuthStore((state) => state.isHydrated);
  const setAuthHydrated = useAuthStore((state) => state.setHydrated);
  const refreshMe = useAuthStore((state) => state.refreshMe);
  const hydrateLikes = useLikesStore((state) => state.hydrate);
  const clearLikes = useLikesStore((state) => state.clear);
  const setLikesHydrated = useLikesStore((state) => state.setHydrated);

  useEffect(() => {
    setAuthHydrated(true);
  }, [setAuthHydrated]);

  useEffect(() => {
    if (!isAuthHydrated) return;

    let cancelled = false;

    if (!token) {
      clearCustomerTokenCookie();
      clearLikes();
      setLikesHydrated(true);
      return undefined;
    }

    setCustomerTokenCookie(token);
    refreshMe().catch(() => {});

    // Avoid flicker after login: keep previous hydrated state while refreshing IDs.
    fetchAllLikedIds(token)
      .then((ids) => {
        if (cancelled) return;
        hydrateLikes(ids);
      })
      .catch(() => {
        if (cancelled) return;
        setLikesHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, [
    isAuthHydrated,
    token,
    refreshMe,
    hydrateLikes,
    clearLikes,
    setLikesHydrated,
  ]);

  return null;
}
