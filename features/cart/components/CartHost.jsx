"use client";

import MiniCart from "@/features/cart/components/MiniCart";
import CartCompanyConflictDialog from "@/features/cart/components/CartCompanyConflictDialog";

/**
 * Mount once in Providers — MiniCart sheet + company conflict dialog.
 */
export default function CartHost() {
  return (
    <>
      <MiniCart />
      <CartCompanyConflictDialog />
    </>
  );
}
