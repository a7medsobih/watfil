"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

import { getRecentStores } from "@/features/browsing/api/get-recent-stores";
import { RECENT_BROWSING_DEFAULT_LIMIT } from "@/features/browsing/constants";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Loads recently visited stores for guest or authenticated customer.
 *
 * @param {{ limit?: number, enabled?: boolean }} [options]
 */
export function useRecentStores({
  limit = RECENT_BROWSING_DEFAULT_LIMIT,
  enabled = true,
} = {}) {
  const locale = useLocale();
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const reload = useCallback(async () => {
    if (!enabled || !isHydrated) return;

    const id = ++requestId.current;
    setIsLoading(true);
    setError(null);

    try {
      const next = await getRecentStores({
        token: token || null,
        limit,
        locale,
      });
      if (id === requestId.current) setItems(next);
    } catch (err) {
      if (id !== requestId.current) return;
      if (err?.status === 401 || err?.status === 403 || err?.status === 422) {
        setItems([]);
        setError(null);
      } else {
        setItems([]);
        setError(err);
      }
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, [enabled, isHydrated, limit, locale, token]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setItems([]);
      return;
    }
    if (!isHydrated) return;
    reload();
  }, [enabled, isHydrated, reload]);

  return { items, isLoading: !isHydrated || isLoading, error, reload };
}
