"use client";

import { useCallback, useState } from "react";

import { useRecordProductView } from "@/features/browsing/hooks/use-record-product-view";
import { normalizeProductSource } from "@/features/browsing/types";

/**
 * Shared product-views session for catalog + company detail pages.
 * Records once on real entry and keeps a live local `viewsCount`.
 *
 * @param {{
 *   companyId: number|string|null|undefined,
 *   productId: number|string|null|undefined,
 *   productSource?: string,
 *   initialViewsCount?: number,
 *   enabled?: boolean,
 * }} options
 */
export function useProductViews({
  companyId = null,
  productId = null,
  productSource = "catalog",
  initialViewsCount = 0,
  enabled = true,
} = {}) {
  const source = normalizeProductSource(productSource);
  const seed = Number(initialViewsCount) || 0;
  const identity = `${companyId ?? ""}:${productId ?? ""}:${source}`;

  const [state, setState] = useState({
    identity,
    seed,
    viewsCount: seed,
  });

  if (identity !== state.identity || seed !== state.seed) {
    setState({
      identity,
      seed,
      viewsCount: seed,
    });
  }

  const handleRecorded = useCallback((result) => {
    setState((prev) => {
      const next = Number(result?.viewsCount);

      if (Number.isFinite(next) && next >= prev.viewsCount) {
        return { ...prev, viewsCount: next };
      }

      // Fallback: first successful non-duplicate view should bump locally.
      if (!result?.duplicateSession) {
        return { ...prev, viewsCount: prev.viewsCount + 1 };
      }

      return prev;
    });
  }, []);

  useRecordProductView({
    companyId,
    productId,
    productSource: source,
    enabled: Boolean(enabled && companyId != null && productId != null),
    onRecorded: handleRecorded,
  });

  return {
    viewsCount: state.viewsCount,
    companyId: companyId ?? null,
    productSource: source,
  };
}
