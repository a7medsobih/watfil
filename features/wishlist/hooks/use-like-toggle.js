"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { likeCompany, unlikeCompany } from "@/features/companies/api";
import { likeProduct, unlikeProduct } from "@/features/wishlist/api";
import { LIKE_SOURCE } from "@/features/wishlist/types";
import { useAuthDialogStore } from "@/stores/auth-dialog-store";
import { useAuthStore, useIsAuthenticated } from "@/stores/auth-store";
import {
  useIsCompanyLiked,
  useIsProductLiked,
  useLikesHydrated,
  useLikesStore,
} from "@/stores/likes-store";

/**
 * Extract optional company extras from a like/unlike API response.
 * @param {unknown} response
 */
function extractCompanyExtras(response) {
  const payload = response?.data ?? response?.company ?? response;
  if (!payload || typeof payload !== "object") return null;

  const extras = {};
  if (payload.average_rating != null) {
    extras.averageRating = Number(payload.average_rating);
  }
  if (payload.likes_count != null) {
    extras.likesCount = Number(payload.likes_count);
  }

  return Object.keys(extras).length ? extras : null;
}

/**
 * Unified optimistic like toggle for products and companies.
 * Guests: opens AuthDialog and stores a pending intent executed after login.
 *
 * @param {object} options
 * @param {'product'|'company'} options.type
 * @param {string|number} options.id
 * @param {'catalog'|'company'} [options.source] Product source
 * @param {string|number} [options.companyId] Required for company-source products
 * @param {boolean} [options.initialLiked] SSR seed until store hydrates
 * @param {number} [options.initialLikesCount]
 * @param {(next: { liked: boolean, likesCount: number, averageRating?: number|null }) => void} [options.onChange]
 * @param {(next: { liked: boolean, likesCount: number, averageRating?: number|null }) => void} [options.onSuccess]
 */
export function useLikeToggle({
  type,
  id,
  source = LIKE_SOURCE.CATALOG,
  companyId,
  initialLiked = false,
  initialLikesCount = 0,
  onChange,
  onSuccess,
} = {}) {
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

  const storeProductLiked = useIsProductLiked(type === "product" ? id : null);
  const storeCompanyLiked = useIsCompanyLiked(type === "company" ? id : null);

  const storeLiked =
    type === "company" ? storeCompanyLiked : storeProductLiked;

  // Prefer store after hydrate; fall back to SSR seed before hydrate.
  const liked = likesHydrated ? storeLiked : Boolean(initialLiked);

  const [likesCount, setLikesCount] = useState(Number(initialLikesCount) || 0);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);
  const likesCountRef = useRef(likesCount);
  likesCountRef.current = likesCount;

  const toastCopy = type === "company" ? tCompany : tWishlist;

  const applyOptimistic = useCallback(
    (nextLiked, nextCount, extras) => {
      if (type === "company") {
        setCompanyLiked(id, nextLiked, extras);
      } else {
        setProductLiked(id, nextLiked);
      }
      setLikesCount(nextCount);
      onChange?.({
        liked: nextLiked,
        likesCount: nextCount,
        averageRating: extras?.averageRating,
      });
    },
    [type, id, setCompanyLiked, setProductLiked, onChange],
  );

  const runToggle = useCallback(
    async ({ forceLiked } = {}) => {
      if (!id || loading) return false;

      const authToken = useAuthStore.getState().token;
      if (!authToken) return false;

      const previousLiked =
        type === "company"
          ? useLikesStore.getState().isCompanyLiked(id)
          : useLikesStore.getState().isProductLiked(id);
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
        let response;
        if (type === "company") {
          response = nextLiked
            ? await likeCompany(id, authToken)
            : await unlikeCompany(id, authToken);
        } else {
          const target = { productId: id, source, companyId };
          response = nextLiked
            ? await likeProduct(target, authToken)
            : await unlikeProduct(target, authToken);
        }

        if (requestId !== requestIdRef.current) return true;

        const extras =
          type === "company" ? extractCompanyExtras(response) : null;
        if (extras) {
          setCompanyLiked(id, nextLiked, extras);
          if (extras.likesCount != null) {
            setLikesCount(extras.likesCount);
          }
          onChange?.({
            liked: nextLiked,
            likesCount: extras.likesCount ?? nextCount,
            averageRating: extras.averageRating,
          });
        }

        onSuccess?.({
          liked: nextLiked,
          likesCount: extras?.likesCount ?? nextCount,
          averageRating: extras?.averageRating,
        });

        if (nextLiked) {
          toast.success(toastCopy("toast.liked"), {
            className:
              type === "product"
                ? "!border-success/30 !bg-success !text-success-foreground"
                : undefined,
          });
        } else {
          toast(toastCopy("toast.unliked"), {
            className:
              type === "product"
                ? "!border-primary/30 !bg-primary !text-primary-foreground"
                : undefined,
          });
        }

        return true;
      } catch {
        if (requestId !== requestIdRef.current) return false;
        applyOptimistic(previousLiked, previousCount);
        toast.error(toastCopy("toast.error"), {
          className:
            type === "product"
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
      source,
      companyId,
      applyOptimistic,
      setCompanyLiked,
      onChange,
      onSuccess,
      toastCopy,
    ],
  );

  const toggleLike = useCallback(async () => {
    if (!id || loading) return;

    if (!isAuthenticated || !token) {
      setPendingLikeIntent({
        type,
        id,
        action: "like",
        ...(type === "product"
          ? { source, companyId }
          : {}),
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
    source,
    companyId,
    setPendingLikeIntent,
    openAuthDialog,
    runToggle,
  ]);

  return {
    liked,
    likesCount,
    toggleLike,
    runToggle,
    loading,
    /** True while likes store is still hydrating for a returning session. */
    isLikesLoading: Boolean(token) && !likesHydrated,
  };
}

/**
 * Execute a pending like intent after successful authentication.
 * @param {{ type: 'product'|'company', id: string|number, action?: string, source?: string, companyId?: string|number }} intent
 * @param {string} token
 */
export async function executePendingLikeIntent(intent, token) {
  if (!intent?.id || !token || intent.action !== "like") return false;

  const { type, id, source, companyId } = intent;

  if (type === "company") {
    const already = useLikesStore.getState().isCompanyLiked(id);
    if (already) return true;
    useLikesStore.getState().setCompanyLiked(id, true);
    try {
      const response = await likeCompany(id, token);
      const extras = extractCompanyExtras(response);
      if (extras) useLikesStore.getState().setCompanyLiked(id, true, extras);
      return true;
    } catch {
      useLikesStore.getState().setCompanyLiked(id, false);
      return false;
    }
  }

  if (type === "product") {
    const already = useLikesStore.getState().isProductLiked(id);
    if (already) return true;
    useLikesStore.getState().setProductLiked(id, true);
    try {
      await likeProduct(
        {
          productId: id,
          source: source ?? LIKE_SOURCE.CATALOG,
          companyId,
        },
        token,
      );
      return true;
    } catch {
      useLikesStore.getState().setProductLiked(id, false);
      return false;
    }
  }

  return false;
}
