import { create } from "zustand";

/**
 * Controls the global auth Dialog (login / register / OTP)
 * and optional post-login like intent for guests.
 */
export const useAuthDialogStore = create((set) => ({
  isOpen: false,
  /** @type {'login' | 'register'} */
  intent: "login",
  /**
   * Pending like action to run after successful auth.
   * @type {{ type: 'product'|'company', id: string|number, action: 'like', source?: string, companyId?: string|number } | null}
   */
  pendingLikeIntent: null,

  openAuthDialog: (intent = "login") =>
    set({
      isOpen: true,
      intent: intent === "register" ? "register" : "login",
    }),

  closeAuthDialog: () => set({ isOpen: false }),

  setAuthDialogOpen: (isOpen) => set({ isOpen: Boolean(isOpen) }),

  setPendingLikeIntent: (pendingLikeIntent) =>
    set({ pendingLikeIntent: pendingLikeIntent ?? null }),

  clearPendingLikeIntent: () => set({ pendingLikeIntent: null }),
}));
