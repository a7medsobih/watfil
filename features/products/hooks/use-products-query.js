"use client";

import { useCallback, useMemo, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import { applyFilterCascade } from "@/features/filters";
import {
  GOVERNORATE_ALL,
  setGovernoratePreferenceClient,
} from "@/features/governorate";
import { useListQueryContext } from "@/features/products/context/list-query-context";
import {
  buildProductsHref,
  resolveProductsParams,
} from "@/features/products/utils/resolve-products-params";
import { useRouter } from "@/i18n/navigation";

/**
 * Products list URL state (searchParams as single source of truth).
 * When inside ListQueryProvider, returns the provided company/catalog query instead.
 *
 * @param {{ productTypes?: object[] }} [options]
 */
export function useProductsQuery(options = {}) {
  const ctx = useListQueryContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { productTypes = [] } = options;

  const params = useMemo(() => {
    return resolveProductsParams(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  const update = useCallback(
    (patch, { resetPage = true } = {}) => {
      const next = applyFilterCascade(params, patch, { productTypes });

      if (resetPage) next.page = 1;

      if (Object.prototype.hasOwnProperty.call(patch, "governorate_id")) {
        if (
          next.governorate_id == null ||
          next.governorate_id === "" ||
          next.governorate_id === "all"
        ) {
          setGovernoratePreferenceClient(GOVERNORATE_ALL);
        } else {
          setGovernoratePreferenceClient(next.governorate_id);
        }
      }

      startTransition(() => {
        router.push(buildProductsHref(next));
      });
    },
    [params, productTypes, router],
  );

  const reset = useCallback(() => {
    startTransition(() => {
      router.push("/products");
    });
  }, [router]);

  const fallback = { params, update, reset, isPending };

  return ctx ?? fallback;
}
