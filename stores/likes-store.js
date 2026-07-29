"use client";

import { create } from "zustand";

function toId(value) {
  if (value == null || value === "") return null;
  return String(value);
}

function idsToMap(ids = []) {
  const map = {};
  for (const id of ids) {
    const key = toId(id);
    if (key) map[key] = true;
  }
  return map;
}

/**
 * Single source of truth for product + company likes.
 * Count is always derived from the ID maps (never stored separately).
 */
export const useLikesStore = create((set, get) => ({
  /** @type {Record<string, true>} */
  likedProductIds: {},
  /** @type {Record<string, true>} */
  likedCompanyIds: {},
  /**
   * Optional extras keyed by company id (e.g. averageRating from like response).
   * @type {Record<string, { averageRating?: number|null, likesCount?: number }>}
   */
  companyExtras: {},
  /** True after bootstrap hydrate (or guest clear) finishes. */
  isHydrated: false,

  setHydrated: (isHydrated = true) => set({ isHydrated: Boolean(isHydrated) }),

  /**
   * Merge liked IDs from GET /customer/likes into the store.
   * Union-merge preserves optimistic likes that may race with hydration.
   * @param {{ productIds?: Array<string|number>, companyIds?: Array<string|number> }} payload
   */
  hydrate: ({ productIds = [], companyIds = [] } = {}) =>
    set((state) => ({
      likedProductIds: {
        ...state.likedProductIds,
        ...idsToMap(productIds),
      },
      likedCompanyIds: {
        ...state.likedCompanyIds,
        ...idsToMap(companyIds),
      },
      isHydrated: true,
    })),

  clear: () =>
    set({
      likedProductIds: {},
      likedCompanyIds: {},
      companyExtras: {},
      isHydrated: false,
    }),

  isProductLiked: (productId) => {
    const key = toId(productId);
    return Boolean(key && get().likedProductIds[key]);
  },

  isCompanyLiked: (companyId) => {
    const key = toId(companyId);
    return Boolean(key && get().likedCompanyIds[key]);
  },

  setProductLiked: (productId, liked) => {
    const key = toId(productId);
    if (!key) return;

    set((state) => {
      const next = { ...state.likedProductIds };
      if (liked) next[key] = true;
      else delete next[key];
      return { likedProductIds: next };
    });
  },

  setCompanyLiked: (companyId, liked, extras) => {
    const key = toId(companyId);
    if (!key) return;

    set((state) => {
      const nextIds = { ...state.likedCompanyIds };
      const nextExtras = { ...state.companyExtras };

      if (liked) {
        nextIds[key] = true;
        if (extras && typeof extras === "object") {
          nextExtras[key] = {
            ...nextExtras[key],
            ...extras,
          };
        }
      } else {
        delete nextIds[key];
        delete nextExtras[key];
      }

      return {
        likedCompanyIds: nextIds,
        companyExtras: nextExtras,
      };
    });
  },

  getCount: () => {
    const state = get();
    return (
      Object.keys(state.likedProductIds).length +
      Object.keys(state.likedCompanyIds).length
    );
  },
}));

/** Derived wishlist badge count (products + companies). */
export function useWishlistCount() {
  return useLikesStore(
    (state) =>
      Object.keys(state.likedProductIds).length +
      Object.keys(state.likedCompanyIds).length,
  );
}

/** Whether likes have finished hydrating for the current session. */
export function useLikesHydrated() {
  return useLikesStore((state) => state.isHydrated);
}

/** Subscribe to whether a product id is liked. */
export function useIsProductLiked(productId) {
  const key = toId(productId);
  return useLikesStore((state) => Boolean(key && state.likedProductIds[key]));
}

/** Subscribe to whether a company id is liked. */
export function useIsCompanyLiked(companyId) {
  const key = toId(companyId);
  return useLikesStore((state) => Boolean(key && state.likedCompanyIds[key]));
}
