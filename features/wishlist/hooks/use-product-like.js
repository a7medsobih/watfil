"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useRequireAuth } from "@/features/auth";
import { likeProduct, unlikeProduct } from "@/features/wishlist/api";
import { LIKE_SOURCE } from "@/features/wishlist/types";
import { useAuthStore, useIsAuthenticated } from "@/stores/auth-store";
import { useWishlistCountStore } from "@/stores/wishlist-count-store";

/**
 * Unified product like hook for catalog + company products.
 *
 * @param {object} options
 * @param {string|number} options.productId
 * @param {'catalog'|'company'} [options.source]
 * @param {string|number} [options.companyId]
 * @param {boolean} [options.initialLiked]
 * @param {number} [options.initialLikesCount]
 * @param {(next: { liked: boolean, likesCount: number }) => void} [options.onChange]
 * @param {(next: { liked: boolean, likesCount: number }) => void} [options.onSuccess]
 */
export function useProductLike({
  productId,
  source = LIKE_SOURCE.CATALOG,
  companyId,
  initialLiked = false,
  initialLikesCount = 0,
  onChange,
  onSuccess,
} = {}) {
  const t = useTranslations("wishlist");
  const isAuthenticated = useIsAuthenticated();
  const token = useAuthStore((state) => state.token);
  const { openLogin } = useRequireAuth("login");
  const incrementCount = useWishlistCountStore((state) => state.increment);
  const decrementCount = useWishlistCountStore((state) => state.decrement);

  const [liked, setLiked] = useState(Boolean(initialLiked));
  const [likesCount, setLikesCount] = useState(Number(initialLikesCount) || 0);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7529/ingest/2917933e-5348-491e-879c-a647a465a9c2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "e4f2de",
      },
      body: JSON.stringify({
        sessionId: "e4f2de",
        runId: "post-fix",
        hypothesisId: "B,D",
        location: "features/wishlist/hooks/use-product-like.js:mount",
        message: "Like button hydrated from server props",
        data: {
          productId,
          initialLiked: Boolean(initialLiked),
          initialLikesCount: Number(initialLikesCount) || 0,
          hasToken: Boolean(token),
          isAuthenticated: Boolean(isAuthenticated),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [productId, initialLiked, initialLikesCount, token, isAuthenticated]);
  // #endregion

  useEffect(() => {
    setLiked(Boolean(initialLiked));
    setLikesCount(Number(initialLikesCount) || 0);
  }, [initialLiked, initialLikesCount, productId]);

  const toggleLike = async () => {
    if (!productId || loading) return;

    if (!isAuthenticated || !token) {
      openLogin();
      return;
    }

    const previousLiked = liked;
    const previousCount = likesCount;
    const nextLiked = !previousLiked;
    const nextCount = Math.max(0, previousCount + (nextLiked ? 1 : -1));

    setLiked(nextLiked);
    setLikesCount(nextCount);
    if (nextLiked) incrementCount();
    else decrementCount();
    onChange?.({ liked: nextLiked, likesCount: nextCount });

    const requestId = ++requestIdRef.current;
    const target = { productId, source, companyId };

    setLoading(true);

    try {
      if (nextLiked) {
        await likeProduct(target, token);
        if (requestId !== requestIdRef.current) return;
        // #region agent log
        fetch("http://127.0.0.1:7529/ingest/2917933e-5348-491e-879c-a647a465a9c2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "e4f2de",
          },
          body: JSON.stringify({
            sessionId: "e4f2de",
            runId: "post-fix",
            hypothesisId: "E",
            location: "features/wishlist/hooks/use-product-like.js:like-success",
            message: "Like API succeeded (client optimistic)",
            data: { productId, nextLiked: true, nextCount },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        onSuccess?.({ liked: true, likesCount: nextCount });
        toast.success(t("toast.liked"), {
          className: "!border-success/30 !bg-success !text-success-foreground",
        });
      } else {
        await unlikeProduct(target, token);
        if (requestId !== requestIdRef.current) return;
        // #region agent log
        fetch("http://127.0.0.1:7529/ingest/2917933e-5348-491e-879c-a647a465a9c2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "e4f2de",
          },
          body: JSON.stringify({
            sessionId: "e4f2de",
            runId: "post-fix",
            hypothesisId: "E",
            location: "features/wishlist/hooks/use-product-like.js:unlike-success",
            message: "Unlike API succeeded (client optimistic)",
            data: { productId, nextLiked: false, nextCount },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        onSuccess?.({ liked: false, likesCount: nextCount });
        toast(t("toast.unliked"), {
          className: "!border-primary/30 !bg-primary !text-primary-foreground",
        });
      }
    } catch (error) {
      // #region agent log
      fetch("http://127.0.0.1:7529/ingest/2917933e-5348-491e-879c-a647a465a9c2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "e4f2de",
        },
        body: JSON.stringify({
          sessionId: "e4f2de",
          runId: "post-fix",
          hypothesisId: "E",
          location: "features/wishlist/hooks/use-product-like.js:error",
          message: "Like/unlike API failed",
          data: {
            productId,
            status: error?.status ?? null,
            errorMessage: error?.message ?? "unknown",
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      if (requestId !== requestIdRef.current) return;
      setLiked(previousLiked);
      setLikesCount(previousCount);
      if (nextLiked) decrementCount();
      else incrementCount();
      onChange?.({ liked: previousLiked, likesCount: previousCount });
      toast.error(t("toast.error"), {
        className:
          "!border-destructive/30 !bg-destructive !text-destructive-foreground",
      });
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  return {
    liked,
    likesCount,
    toggleLike,
    loading,
  };
}
