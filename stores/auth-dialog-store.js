import { create } from "zustand";

/**
 * Controls the global auth Dialog (login / register / OTP).
 */
export const useAuthDialogStore = create((set) => ({
  isOpen: false,
  /** @type {'login' | 'register'} */
  intent: "login",

  openAuthDialog: (intent = "login") =>
    set({
      isOpen: true,
      intent: intent === "register" ? "register" : "login",
    }),

  closeAuthDialog: () => set({ isOpen: false }),

  setAuthDialogOpen: (isOpen) => set({ isOpen: Boolean(isOpen) }),
}));
