import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Shopping cart (client state). Persist for guests; sync with API when auth is ready.
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      add: (item, quantity = 1) => {
        const existing = get().items.find((entry) => entry.id === item.id);

        if (existing) {
          set((state) => ({
            items: state.items.map((entry) =>
              entry.id === item.id
                ? { ...entry, quantity: entry.quantity + quantity }
                : entry,
            ),
          }));
          return;
        }

        set((state) => ({
          items: [...state.items, { ...item, quantity }],
        }));
      },

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.id !== id),
        })),

      increase: (id) =>
        set((state) => ({
          items: state.items.map((entry) =>
            entry.id === id
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry,
          ),
        })),

      decrease: (id) =>
        set((state) => ({
          items: state.items
            .map((entry) =>
              entry.id === id
                ? { ...entry, quantity: entry.quantity - 1 }
                : entry,
            )
            .filter((entry) => entry.quantity > 0),
        })),

      clear: () => set({ items: [] }),

      count: () =>
        get().items.reduce((total, entry) => total + entry.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (total, entry) => total + (entry.price ?? 0) * entry.quantity,
          0,
        ),

      /** Alias for checkout total (extend later with shipping/tax). */
      total: () => get().subtotal(),
    }),
    {
      name: "watfil-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
