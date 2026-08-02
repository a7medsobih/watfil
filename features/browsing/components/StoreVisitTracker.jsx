"use client";

import { useRecordStoreVisit } from "@/features/browsing/hooks/use-record-store-visit";

/**
 * Fire-and-forget store visit recorder for company pages.
 * Renders nothing.
 */
export default function StoreVisitTracker({
  companyId,
  enabled = true,
  onRecorded,
}) {
  useRecordStoreVisit({ companyId, enabled, onRecorded });
  return null;
}
