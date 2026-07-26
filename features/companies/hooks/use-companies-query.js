"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { useRouter } from "@/i18n/navigation";
import {
  buildCompaniesHref,
  resolveCompaniesParams,
} from "@/features/companies/utils/resolve-companies-params";

/**
 * Companies list URL state (searchParams as single source of truth).
 */
export function useCompaniesQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    return resolveCompaniesParams(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  const update = useCallback(
    (patch, { resetPage = true } = {}) => {
      const next = {
        ...params,
        ...patch,
      };

      if (resetPage) next.page = 1;

      // Explicit null/all clears governorate from the URL.
      if (
        next.governorate_id === null ||
        next.governorate_id === "" ||
        next.governorate_id === "all"
      ) {
        next.governorate_id = null;
      }

      router.push(buildCompaniesHref(next));
    },
    [params, router],
  );

  const reset = useCallback(() => {
    router.push("/companies");
  }, [router]);

  return { params, update, reset };
}
