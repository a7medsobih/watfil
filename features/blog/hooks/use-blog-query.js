"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { useRouter } from "@/i18n/navigation";
import {
  buildBlogHref,
  resolveArticlesParams,
} from "@/features/blog/utils/resolve-articles-params";

/**
 * Blog list URL state (searchParams as single source of truth).
 */
export function useBlogQuery() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    return resolveArticlesParams(
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

      router.push(buildBlogHref(next));
    },
    [params, router],
  );

  const reset = useCallback(() => {
    router.push("/blog");
  }, [router]);

  return { params, update, reset };
}
