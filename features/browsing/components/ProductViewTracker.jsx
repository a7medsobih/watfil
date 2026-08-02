"use client";

import { useRecordProductView } from "@/features/browsing/hooks/use-record-product-view";

/**
 * Fire-and-forget product view recorder.
 * Prefer `useProductViews` when the UI must show a live views_count.
 */
export default function ProductViewTracker({
  companyId,
  productId,
  productSource = "catalog",
  enabled = true,
  onRecorded,
}) {
  useRecordProductView({
    companyId,
    productId,
    productSource,
    enabled,
    onRecorded,
  });
  return null;
}
