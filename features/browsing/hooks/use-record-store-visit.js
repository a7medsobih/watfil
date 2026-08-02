"use client";

import { useCallback, useEffect, useRef } from "react";

import { recordStoreVisit } from "@/features/browsing/api/record-store-visit";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Records a store visit once per company mount. Silent on errors / duplicates.
 *
 * @param {{
 *   companyId: number|string|null|undefined,
 *   enabled?: boolean,
 *   onRecorded?: (result: { viewsCount: number, duplicateSession: boolean, lastVisitedAt: string|null }) => void,
 * }} options
 */
export function useRecordStoreVisit({
  companyId,
  enabled = true,
  onRecorded,
} = {}) {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const trackedKey = useRef(null);
  const onRecordedRef = useRef(onRecorded);

  useEffect(() => {
    onRecordedRef.current = onRecorded;
  }, [onRecorded]);

  const record = useCallback(async () => {
    if (!enabled || companyId == null || companyId === "") return;
    if (!isHydrated) return;

    const key = String(companyId);
    if (trackedKey.current === key) return;
    trackedKey.current = key;

    try {
      const result = await recordStoreVisit({
        companyId,
        token: token || null,
      });
      if (result) onRecordedRef.current?.(result);
    } catch {
      // Browsing is best-effort; never surface to the user.
      trackedKey.current = null;
    }
  }, [companyId, enabled, isHydrated, token]);

  useEffect(() => {
    record();
  }, [record]);
}
