"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { useRouter } from "@/i18n/navigation";
import {
  buildProductsHref,
  resolveProductsParams,
} from "@/features/products/utils/resolve-products-params";

/**
 * Products list URL state (searchParams as single source of truth).
 */
export function useProductsQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    return resolveProductsParams(
      Object.fromEntries(searchParams.entries()),
    );
  }, [searchParams]);

  const update = useCallback(
    (patch, { resetPage = true } = {}) => {
      const next = {
        ...params,
        ...patch,
      };

      if (resetPage) next.page = 1;

      router.push(buildProductsHref(next));
    },
    [params, router],
  );

  const reset = useCallback(() => {
    router.push("/products");
  }, [router]);

  return { params, update, reset };
}
