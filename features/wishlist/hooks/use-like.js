"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { setLike } from "@/features/wishlist/api";
import {
  LIKE_TYPE,
  isProductLikeType,
  resolveLikeType,
} from "@/features/wishlist/types";
import { useAuthDialogStore } from "@/stores/auth-dialog-store";
import { useAuthStore, useIsAuthenticated } from "@/stores/auth-store";
import {
  useIsCompanyLiked,
  useIsProductLiked,
  useLikesHydrated,
  useLikesStore,
} from "@/stores/likes-store";

/**
 * Unified optimistic like hook for companies + products.
 *
 * Guests: opens AuthDialog and stores a pending intent executed after login.
 * Authenticated: optimistic UI → POST/DELETE /customer/likes → reconcile from
 * `data.company` / `data.product`. 422 (already liked / not liked) is treated
 * as success (idempotent).
 *
 * @param {object} options
 * @param {'company'|'company_product'|'catalog_product'} [options.type]
 * @param {'catalog'|'company'} [options.source] Resolves type for products
 * @param {'product'|'company'} [options.kind] Convenience when type omitted
 * @param {string|number} options.id
 * @param {string|number} [options.companyId] Required for company_product
 * @param {boolean} [options.initialLiked]
 * @param {number} [options.initialLikesCount]
 * @param {(next: { liked: boolean, likesCount: number, averageRating?: number|null }) => void} [options.onChange]
 * @param {(next: { liked: boolean, likesCount: number, averageRating?: number|null }) => void} [options.onSuccess]
 */
export function useLike({
  type: typeProp,
  source,
  kind,
  id,
  companyId,
  initialLiked = false,
  initialLikesCount = 0,
  onChange,
  onSuccess,
} = {}) {
  const type = resolveLikeType({ type: typeProp, source, kind });
  const isProduct = isProductLikeType(type);

  const tWishlist = useTranslations("wishlist");
  const tCompany = useTranslations("company");
  const isAuthenticated = useIsAuthenticated();
  const token = useAuthStore((state) => state.token);
  const likesHydrated = useLikesHydrated();
  const openAuthDialog = useAuthDialogStore((state) => state.openAuthDialog);
  const setPendingLikeIntent = useAuthDialogStore(
    (state) => state.setPendingLikeIntent,
  );
  const setProductLiked = useLikesStore((state) => state.setProductLiked);
  const setCompanyLiked = useLikesStore((state) => state.setCompanyLiked);

  const storeProductLiked = useIsProductLiked(isProduct ? id : null);
  const storeCompanyLiked = useIsCompanyLiked(!isProduct ? id : null);
  const storeLiked = isProduct ? storeProductLiked : storeCompanyLiked;

  const liked = likesHydrated ? storeLiked : Boolean(initialLiked);

  const [likesCount, setLikesCount] = useState(Number(initialLikesCount) || 0);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);
  const likesCountRef = useRef(likesCount);
  likesCountRef.current = likesCount;

  useEffect(() => {
    setLikesCount(Number(initialLikesCount) || 0);
  }, [id, type, initialLikesCount]);

  const toastCopy = isProduct ? tWishlist : tCompany;

  const applyOptimistic = useCallback(
    (nextLiked, nextCount, extras) => {
      if (isProduct) {
        setProductLiked(id, nextLiked);
      } else {
        setCompanyLiked(id, nextLiked, extras);
      }
      setLikesCount(nextCount);
      onChange?.({
        liked: nextLiked,
        likesCount: nextCount,
        averageRating: extras?.averageRating,
      });
    },
    [isProduct, id, setCompanyLiked, setProductLiked, onChange],
  );

  const reconcile = useCallback(
    (result, fallbackLiked, fallbackCount) => {
      const nextLiked =
        result?.isLiked != null ? Boolean(result.isLiked) : fallbackLiked;
      const nextCount =
        result?.likesCount != null ? Number(result.likesCount) : fallbackCount;
      const extras =
        !isProduct && result
          ? {
              ...(result.averageRating != null
                ? { averageRating: result.averageRating }
                : {}),
              likesCount: nextCount,
            }
          : undefined;

      if (isProduct) {
        setProductLiked(id, nextLiked);
      } else {
        setCompanyLiked(id, nextLiked, extras);
      }
      setLikesCount(nextCount);
      onChange?.({
        liked: nextLiked,
        likesCount: nextCount,
        averageRating: extras?.averageRating,
      });
      return { liked: nextLiked, likesCount: nextCount, averageRating: extras?.averageRating };
    },
    [isProduct, id, setProductLiked, setCompanyLiked, onChange],
  );

  const runToggle = useCallback(
    async ({ forceLiked } = {}) => {
      if (!id || loading) return false;

      const authToken = useAuthStore.getState().token;
      if (!authToken) return false;

      if (type === LIKE_TYPE.COMPANY_PRODUCT && (companyId == null || companyId === "")) {
        toast.error(toastCopy("toast.error"));
        return false;
      }

      const previousLiked = isProduct
        ? useLikesStore.getState().isProductLiked(id)
        : useLikesStore.getState().isCompanyLiked(id);
      const previousCount = likesCountRef.current;
      const nextLiked =
        forceLiked != null ? Boolean(forceLiked) : !previousLiked;
      const nextCount = Math.max(
        0,
        previousCount + (nextLiked === previousLiked ? 0 : nextLiked ? 1 : -1),
      );

      applyOptimistic(nextLiked, nextCount);

      const requestId = ++requestIdRef.current;
      setLoading(true);

      try {
        const result = await setLike(
          {
            type,
            id,
            companyId,
            liked: nextLiked,
          },
          authToken,
        );

        if (requestId !== requestIdRef.current) return true;

        const reconciled = reconcile(result, nextLiked, nextCount);
        onSuccess?.(reconciled);

        if (reconciled.liked) {
          toast.success(toastCopy("toast.liked"), {
            className: isProduct
              ? "!border-success/30 !bg-success !text-success-foreground"
              : undefined,
          });
        } else {
          toast(toastCopy("toast.unliked"), {
            className: isProduct
              ? "!border-primary/30 !bg-primary !text-primary-foreground"
              : undefined,
          });
        }

        return true;
      } catch (error) {
        if (requestId !== requestIdRef.current) return false;

        // 422 = already liked / not liked — treat as idempotent success.
        if (error?.status === 422) {
          const reconciled = reconcile(null, nextLiked, nextCount);
          onSuccess?.(reconciled);
          return true;
        }

        applyOptimistic(previousLiked, previousCount);
        toast.error(toastCopy("toast.error"), {
          className: isProduct
            ? "!border-destructive/30 !bg-destructive !text-destructive-foreground"
            : undefined,
        });
        return false;
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [
      id,
      loading,
      type,
      companyId,
      isProduct,
      applyOptimistic,
      reconcile,
      onSuccess,
      toastCopy,
    ],
  );

  const like = useCallback(async () => {
    if (liked) return true;
    return runToggle({ forceLiked: true });
  }, [liked, runToggle]);

  const unlike = useCallback(async () => {
    if (!liked) return true;
    return runToggle({ forceLiked: false });
  }, [liked, runToggle]);

  const toggleLike = useCallback(async () => {
    if (!id || loading) return;

    if (!isAuthenticated || !token) {
      setPendingLikeIntent({
        type,
        id,
        companyId: type === LIKE_TYPE.COMPANY_PRODUCT ? companyId : undefined,
        action: "like",
      });
      openAuthDialog("login");
      return;
    }

    await runToggle();
  }, [
    id,
    loading,
    isAuthenticated,
    token,
    type,
    companyId,
    setPendingLikeIntent,
    openAuthDialog,
    runToggle,
  ]);

  return {
    type,
    liked,
    likesCount,
    toggleLike,
    like,
    unlike,
    runToggle,
    loading,
    /** True while likes store is still hydrating for a returning session. */
    isLikesLoading: Boolean(token) && !likesHydrated,
  };
}

/**
 * Execute a pending like intent after successful authentication.
 * @param {{ type: string, id: string|number, action?: string, companyId?: string|number, source?: string }} intent
 * @param {string} token
 */
export async function executePendingLikeIntent(intent, token) {
  if (!intent?.id || !token || intent.action !== "like") return false;

  const type = resolveLikeType({
    type: intent.type,
    source: intent.source,
    kind: intent.type === "product" ? "product" : intent.type === "company" ? "company" : undefined,
  });
  const id = intent.id;
  const companyId = intent.companyId;
  const isProduct = isProductLikeType(type);

  if (type === LIKE_TYPE.COMPANY_PRODUCT && (companyId == null || companyId === "")) {
    return false;
  }

  const already = isProduct
    ? useLikesStore.getState().isProductLiked(id)
    : useLikesStore.getState().isCompanyLiked(id);

  if (already) return true;

  if (isProduct) {
    useLikesStore.getState().setProductLiked(id, true);
  } else {
    useLikesStore.getState().setCompanyLiked(id, true);
  }

  try {
    const result = await setLike(
      { type, id, companyId, liked: true },
      token,
    );

    if (isProduct) {
      useLikesStore.getState().setProductLiked(id, result.isLiked ?? true);
    } else {
      useLikesStore.getState().setCompanyLiked(id, result.isLiked ?? true, {
        ...(result.averageRating != null
          ? { averageRating: result.averageRating }
          : {}),
        ...(result.likesCount != null ? { likesCount: result.likesCount } : {}),
      });
    }
    return true;
  } catch (error) {
    if (error?.status === 422) return true;

    if (isProduct) {
      useLikesStore.getState().setProductLiked(id, false);
    } else {
      useLikesStore.getState().setCompanyLiked(id, false);
    }
    return false;
  }
}
