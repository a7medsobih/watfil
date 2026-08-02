"use client";

import { useEffect } from "react";

import { rememberStoreShareSource } from "@/features/checkout/utils/order-source";

/**
 * Client island: persist order_source=link when landing on /store/{tax}.
 */
export default function StoreShareSourceTracker({
  companyId = null,
  taxNumber = null,
}) {
  useEffect(() => {
    if (companyId == null && !taxNumber) return;
    rememberStoreShareSource({ companyId, taxNumber });
  }, [companyId, taxNumber]);

  return null;
}
