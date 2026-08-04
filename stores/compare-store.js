import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Catalog compare accepts exactly two products (API `product_ids` size = 2). */
const MAX_COMPARE_ITEMS = 2;

/**
 * Product compare list (client state, persisted for guests + customers).
 * Frontend owns selection; `is_in_compare` from API is a placeholder.
 */
export const useCompareStore = create(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: Boolean(value) }),

      add: (item) => {
        if (!item?.id) return { status: "invalid" };

        const { items } = get();
        const id = Number(item.id);
        if (!Number.isFinite(id) || id <= 0) return { status: "invalid" };

        if (items.some((entry) => Number(entry.id) === id)) {
          return { status: "duplicate" };
        }
        if (items.length >= MAX_COMPARE_ITEMS) {
          return { status: "full" };
        }

        set({
          items: [
            ...items,
            {
              id,
              name: item.name ?? null,
              image: item.image ?? null,
            },
          ],
        });
        return { status: "added" };
      },

      remove: (id) => {
        const target = Number(id);
        set((state) => ({
          items: state.items.filter((entry) => Number(entry.id) !== target),
        }));
        return { status: "removed" };
      },

      clear: () => set({ items: [] }),

      has: (id) => {
        const target = Number(id);
        return get().items.some((entry) => Number(entry.id) === target);
      },

      count: () => get().items.length,

      canAdd: () => get().items.length < MAX_COMPARE_ITEMS,

      ids: () => get().items.map((entry) => Number(entry.id)),
    }),
    {
      name: "watfil-compare",
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => {
        const rawItems = Array.isArray(persisted?.items)
          ? persisted.items
          : [];
        const items = [];
        const seen = new Set();

        for (const entry of rawItems) {
          const id = Number(entry?.id);
          if (!Number.isFinite(id) || id <= 0 || seen.has(id)) continue;
          seen.add(id);
          items.push({
            id,
            name: entry.name ?? null,
            image: entry.image ?? null,
          });
          if (items.length >= MAX_COMPARE_ITEMS) break;
        }

        return {
          ...current,
          ...persisted,
          items,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export { MAX_COMPARE_ITEMS };
