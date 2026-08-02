"use client";

import { useCallback, useEffect, useRef } from "react";

import { recordProductView } from "@/features/browsing/api/record-product-view";
import { normalizeProductSource } from "@/features/browsing/types";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Records a product view once per company+product+source mount.
 *
 * @param {{
 *   companyId: number|string|null|undefined,
 *   productId: number|string|null|undefined,
 *   productSource?: string,
 *   enabled?: boolean,
 *   onRecorded?: (result: { viewsCount: number, duplicateSession: boolean, lastViewedAt: string|null }) => void,
 * }} options
 */
export function useRecordProductView({
  companyId,
  productId,
  productSource = "catalog",
  enabled = true,
  onRecorded,
} = {}) {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const trackedKey = useRef(null);
  const onRecordedRef = useRef(onRecorded);
  const source = normalizeProductSource(productSource);

  useEffect(() => {
    onRecordedRef.current = onRecorded;
  }, [onRecorded]);

  const record = useCallback(async () => {
    if (!enabled) return;
    if (companyId == null || companyId === "") return;
    if (productId == null || productId === "") return;
    if (!isHydrated) return;

    const key = `${companyId}:${productId}:${source}`;
    if (trackedKey.current === key) return;
    trackedKey.current = key;

    try {
      const result = await recordProductView({
        companyId,
        productId,
        productSource: source,
        token: token || null,
      });
      if (result) onRecordedRef.current?.(result);
    } catch {
      trackedKey.current = null;
    }
  }, [companyId, enabled, isHydrated, productId, source, token]);

  useEffect(() => {
    record();
  }, [record]);
}
