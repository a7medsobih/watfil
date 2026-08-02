import { create } from "zustand";

/**
 * Controls the global auth Dialog (login / register)
 * and optional post-login like intent for guests.
 */
export const useAuthDialogStore = create((set) => ({
  isOpen: false,
  /** @type {'login' | 'register'} */
  intent: "login",
  /**
   * Preferred company to link on register (checkout / store share).
   * @type {string|number|null}
   */
  companyId: null,
  /**
   * Pending like action to run after successful auth.
   * @type {{ type: 'company'|'company_product'|'catalog_product'|string, id: string|number, action: 'like', source?: string, companyId?: string|number } | null}
   */
  pendingLikeIntent: null,

  /**
   * @param {'login' | 'register'} [intent]
   * @param {{ companyId?: string|number|null }} [options]
   */
  openAuthDialog: (intent = "login", options = {}) =>
    set({
      isOpen: true,
      intent: intent === "register" ? "register" : "login",
      companyId:
        options?.companyId != null && options.companyId !== ""
          ? options.companyId
          : null,
    }),

  closeAuthDialog: () => set({ isOpen: false, companyId: null }),

  setAuthDialogOpen: (isOpen) =>
    set(() => ({
      isOpen: Boolean(isOpen),
      ...(isOpen ? {} : { companyId: null }),
    })),

  setPendingLikeIntent: (pendingLikeIntent) =>
    set({ pendingLikeIntent: pendingLikeIntent ?? null }),

  clearPendingLikeIntent: () => set({ pendingLikeIntent: null }),
}));
