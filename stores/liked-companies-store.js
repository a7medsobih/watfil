"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Local cache of liked companies (no GET /customer/likes/companies yet).
 * Synced from CompanyLikeButton; used by wishlist companies tab.
 */
export const useLikedCompaniesStore = create(
  persist(
    (set, get) => ({
      items: [],

      upsert: (company) => {
        if (!company?.id) return;
        const current = get().items;
        const index = current.findIndex(
          (item) => String(item.id) === String(company.id),
        );
        const nextItem = {
          id: company.id,
          slug: company.slug ?? null,
          name: company.name ?? "",
          logo: company.logo ?? null,
          hasLogo: Boolean(company.hasLogo),
          rating: company.rating ?? null,
          reviews: company.reviews ?? 0,
          likes: company.likes ?? 0,
          governorate: company.governorate ?? null,
          coverage: company.coverage ?? null,
          verified: Boolean(company.verified),
        };

        if (index === -1) {
          set({ items: [nextItem, ...current] });
          return;
        }

        const next = [...current];
        next[index] = { ...next[index], ...nextItem };
        set({ items: next });
      },

      remove: (companyId) => {
        if (companyId == null) return;
        set({
          items: get().items.filter(
            (item) => String(item.id) !== String(companyId),
          ),
        });
      },

      setLiked: (company, liked) => {
        if (liked) get().upsert(company);
        else get().remove(company?.id ?? company);
      },
    }),
    {
      name: "watfil-liked-companies",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
