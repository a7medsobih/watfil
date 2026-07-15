import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE_ITEMS = 4;

/**
 * Product compare list (client state, persisted for guests).
 */
export const useCompareStore = create(
  persist(
    (set, get) => ({
      items: [],

      add: (item) => {
        const { items } = get();
        if (items.some((entry) => entry.id === item.id)) return;
        if (items.length >= MAX_COMPARE_ITEMS) return;

        set({ items: [...items, item] });
      },

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.id !== id),
        })),

      clear: () => set({ items: [] }),

      has: (id) => get().items.some((entry) => entry.id === id),

      count: () => get().items.length,

      canAdd: () => get().items.length < MAX_COMPARE_ITEMS,
    }),
    {
      name: "watfil-compare",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export { MAX_COMPARE_ITEMS };
