"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { MAX_COMPARE_ITEMS, useCompareStore } from "@/stores/compare-store";

/**
 * Toggle a catalog product in the local compare list (max 2).
 * Subscribes to `items` so active UI updates immediately after add/remove.
 */
export function useCompareToggle() {
  const t = useTranslations("compare");
  const items = useCompareStore((state) => state.items);
  const add = useCompareStore((state) => state.add);
  const remove = useCompareStore((state) => state.remove);
  const hasHydrated = useCompareStore((state) => state.hasHydrated);

  const isInCompare = useCallback(
    (productId) => {
      if (!hasHydrated || productId == null) return false;
      const id = Number(productId);
      return items.some((entry) => Number(entry.id) === id);
    },
    [items, hasHydrated],
  );

  const toggle = useCallback(
    (product) => {
      if (!product?.id) return { status: "invalid" };

      const id = Number(product.id);
      const alreadyIn = items.some((entry) => Number(entry.id) === id);

      if (alreadyIn) {
        remove(product.id);
        toast.message(t("toast.removed"));
        return { status: "removed" };
      }

      const result = add({
        id: product.id,
        name: product.name,
        image: product.image,
      });

      if (result.status === "added") {
        toast.success(t("toast.added"));
      } else if (result.status === "full") {
        toast.message(t("toast.full", { max: MAX_COMPARE_ITEMS }));
      }

      return result;
    },
    [add, items, remove, t],
  );

  return { toggle, isInCompare, hasHydrated, maxItems: MAX_COMPARE_ITEMS };
}
