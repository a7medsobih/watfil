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
    openAuth: () => openAuthDialog(intent),
    openLogin: () => openAuthDialog("login"),
    openRegister: () => openAuthDialog("register"),
    isAuthDialogOpen: isOpen,
  };
}
