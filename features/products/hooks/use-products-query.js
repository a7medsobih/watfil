"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { applyFilterCascade } from "@/features/filters";
import {
  buildProductsHref,
  resolveProductsParams,
} from "@/features/products/utils/resolve-products-params";
import { useRouter } from "@/i18n/navigation";

/**
 * Products list URL state (searchParams as single source of truth).
 *
 * @param {{ productTypes?: object[] }} [options]
 */
export function useProductsQuery(options = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { productTypes = [] } = options;

  const params = useMemo(() => {
    return resolveProductsParams(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  const update = useCallback(
    (patch, { resetPage = true } = {}) => {
      const next = applyFilterCascade(params, patch, { productTypes });

      if (resetPage) next.page = 1;

      router.push(buildProductsHref(next));
    },
    [params, productTypes, router],
  );

  const reset = useCallback(() => {
    router.push("/products");
  }, [router]);

  return { params, update, reset };
}
