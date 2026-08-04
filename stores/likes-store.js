"use client";

import { create } from "zustand";

import { buildLikeKey } from "@/features/wishlist/types";

function toId(value) {
  if (value == null || value === "") return null;
  return String(value);
}

function keysToMap(keys = []) {
  const map = {};
  for (const key of keys) {
    if (typeof key === "string" && key) map[key] = true;
  }
  return map;
}

/**
 * Resolve a namespaced product like key from a string key or identity params.
 * @param {string|{ type?: string, source?: string, id?: string|number, companyId?: string|number }|null|undefined} target
 * @returns {string|null}
 */
export function resolveProductLikeKey(target) {
  if (target == null || target === "") return null;
  if (typeof target === "string") return target;
  if (typeof target === "object") {
    return buildLikeKey({
      type: target.type,
      source: target.source,
      kind: "product",
      id: target.id,
    });
  }
  return null;
}

/**
 * Single source of truth for product + company likes.
 *
 * Product entries are keyed by namespaced like keys (never bare numeric ids):
 * - `catalog_product:{id}`
 * - `company_product:{id}`
 *
 * Company likes stay in a separate map keyed by company id
 * (API type `company`).
 *
 * Count is always derived from the maps (never stored separately).
 */
export const useLikesStore = create((set, get) => ({
  /** @type {Record<string, true>} namespaced product like keys */
  likedProductKeys: {},
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
   * Merge liked keys from GET /customer/likes into the store.
   * Union-merge preserves optimistic likes that may race with hydration.
   * @param {{ productKeys?: string[], companyIds?: Array<string|number> }} payload
   */
  hydrate: ({ productKeys = [], companyIds = [] } = {}) =>
    set((state) => ({
      likedProductKeys: {
        ...state.likedProductKeys,
        ...keysToMap(productKeys),
      },
      likedCompanyIds: {
        ...state.likedCompanyIds,
        ...keysToMap((companyIds || []).map(toId).filter(Boolean)),
      },
      isHydrated: true,
    })),

  clear: () =>
    set({
      likedProductKeys: {},
      likedCompanyIds: {},
      companyExtras: {},
      isHydrated: false,
    }),

  /**
   * @param {string|{ type?: string, source?: string, id?: string|number, companyId?: string|number }} target
   */
  isProductLiked: (target) => {
    const key = resolveProductLikeKey(target);
    return Boolean(key && get().likedProductKeys[key]);
  },

  isCompanyLiked: (companyId) => {
    const key = toId(companyId);
    return Boolean(key && get().likedCompanyIds[key]);
  },

  /**
   * @param {string|{ type?: string, source?: string, id?: string|number, companyId?: string|number }} target
   * @param {boolean} liked
   */
  setProductLiked: (target, liked) => {
    const key = resolveProductLikeKey(target);
    if (!key) return;

    set((state) => {
      const next = { ...state.likedProductKeys };
      if (liked) next[key] = true;
      else delete next[key];
      return { likedProductKeys: next };
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
      Object.keys(state.likedProductKeys).length +
      Object.keys(state.likedCompanyIds).length
    );
  },
}));

/** Derived wishlist badge count (products + companies). */
export function useWishlistCount() {
  return useLikesStore(
    (state) =>
      Object.keys(state.likedProductKeys).length +
      Object.keys(state.likedCompanyIds).length,
  );
}

/** Whether likes have finished hydrating for the current session. */
export function useLikesHydrated() {
  return useLikesStore((state) => state.isHydrated);
}

/**
 * Subscribe to whether a product like target is liked.
 * Pass identity params (preferred) or a prebuilt namespaced key string.
 *
 * @param {string|{ type?: string, source?: string, id?: string|number|null, companyId?: string|number|null }|null|undefined} target
 */
export function useIsProductLiked(target) {
  const key = resolveProductLikeKey(target);
  return useLikesStore((state) => Boolean(key && state.likedProductKeys[key]));
}

/** Subscribe to whether a company id is liked. */
export function useIsCompanyLiked(companyId) {
  const key = toId(companyId);
  return useLikesStore((state) => Boolean(key && state.likedCompanyIds[key]));
}
