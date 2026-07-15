import { create } from "zustand";
import { persist } from "zustand/middleware";

import { apiClient, buildUrl } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

/**
 * Guest wishlist lives in localStorage (persist).
 * After login, call `syncWithServer` → POST wishlist/sync → replace with server state.
 */
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      isSynced: false,

      add: (item) => {
        const exists = get().items.some((entry) => entry.id === item.id);
        if (exists) return;
        set((state) => ({ items: [...state.items, item], isSynced: false }));
      },

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.id !== id),
          isSynced: false,
        })),

      toggle: (item) => {
        const exists = get().items.some((entry) => entry.id === item.id);
        if (exists) {
          get().remove(item.id);
        } else {
          get().add(item);
        }
      },

      clear: () => set({ items: [], isSynced: false }),

      has: (id) => get().items.some((entry) => entry.id === id),

      count: () => get().items.length,

      /**
       * Call after successful login to migrate guest wishlist to the server.
       */
      syncWithServer: async () => {
        const { items } = get();

        const response = await fetch(buildUrl(endpoints.wishlist.sync), {
          method: "POST",
          headers: apiClient.headers,
          credentials: "include",
          body: JSON.stringify({ items }),
        });

        if (!response.ok) {
          throw new Error("Wishlist sync failed");
        }

        const data = await response.json();
        const syncedItems = data.items ?? items;

        set({ items: syncedItems, isSynced: true });
        return syncedItems;
      },

      /** Replace local state with authoritative server wishlist. */
      hydrateFromServer: (items) => set({ items: items ?? [], isSynced: true }),
    }),
    {
      name: "watfil-wishlist",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
