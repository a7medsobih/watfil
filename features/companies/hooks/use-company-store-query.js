"use client";

import { useCallback, useMemo, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import { applyFilterCascade } from "@/features/filters";
import {
  buildCompanyStoreHref,
  resolveCompanyStoreParams,
} from "@/features/companies/utils/resolve-company-store-params";
import { useRouter } from "@/i18n/navigation";

/**
 * Company store products URL state (searchParams as single source of truth).
 * Soft-navigates via router.replace({ scroll: false }) so the store section
 * keeps its scroll position while filters / pagination update.
 *
 * @param {{ companyId: string|number, productTypes?: object[] }} options
 */
export function useCompanyStoreQuery(options) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { companyId, productTypes = [] } = options;

  const params = useMemo(() => {
    return resolveCompanyStoreParams(
      Object.fromEntries(searchParams.entries()),
    );
  }, [searchParams]);

  const update = useCallback(
    (patch, { resetPage = true } = {}) => {
      const next = applyFilterCascade(params, patch, { productTypes });

      if (resetPage) next.page = 1;

      startTransition(() => {
        router.replace(buildCompanyStoreHref(companyId, next), {
          scroll: false,
        });
      });
    },
    [params, productTypes, router, companyId],
  );

  const reset = useCallback(() => {
    startTransition(() => {
      router.replace(buildCompanyStoreHref(companyId, {}), {
        scroll: false,
      });
    });
  }, [router, companyId]);

  return { params, update, reset, isPending };
}
