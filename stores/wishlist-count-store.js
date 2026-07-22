import { create } from "zustand";

/**
 * Lightweight wishlist badge counter only — no product list.
 */
export const useWishlistCountStore = create((set, get) => ({
  count: 0,

  setCount: (count) => set({ count: Math.max(0, Number(count) || 0) }),

  increment: () => set((state) => ({ count: state.count + 1 })),

  decrement: () =>
    set((state) => ({ count: Math.max(0, state.count - 1) })),

  reset: () => set({ count: 0 }),

  getCount: () => get().count,
}));
