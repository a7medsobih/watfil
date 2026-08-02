"use client";

import { useAuthDialogStore } from "@/stores/auth-dialog-store";

/**
 * Open the global auth Dialog from any client component.
 * @param {'login' | 'register'} [intent]
 */
export function useRequireAuth(intent = "login") {
  const openAuthDialog = useAuthDialogStore((state) => state.openAuthDialog);
  const isOpen = useAuthDialogStore((state) => state.isOpen);

  return {
    /**
     * @param {{ companyId?: string|number|null }} [options]
     */
    openAuth: (options) => openAuthDialog(intent, options),
    /**
     * @param {{ companyId?: string|number|null }} [options]
     */
    openLogin: (options) => openAuthDialog("login", options),
    /**
     * @param {{ companyId?: string|number|null }} [options]
     */
    openRegister: (options) => openAuthDialog("register", options),
    isAuthDialogOpen: isOpen,
  };
}
