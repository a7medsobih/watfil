import { readOrderSource } from "@/features/checkout/utils/order-source";
import { useCartStore } from "@/stores/cart-store";

/**
 * Resolve the company to link on POST /customer/register.
 * Priority: explicit override → cart seller → store-share session.
 *
 * @param {string|number|null|undefined} [overrideCompanyId]
 * @returns {{ companyId: number|null, companyName: string|null, locked: boolean }}
 */
export function resolveRegisterCompany(overrideCompanyId = null) {
  const override = Number(overrideCompanyId);
  if (Number.isFinite(override) && override > 0) {
    const cart = useCartStore.getState().company;
    const name =
      cart && Number(cart.id) === override ? (cart.name ?? null) : null;
    return { companyId: override, companyName: name, locked: true };
  }

  const cart = useCartStore.getState().company;
  const cartId = Number(cart?.id);
  if (Number.isFinite(cartId) && cartId > 0) {
    return {
      companyId: cartId,
      companyName: cart?.name ?? null,
      locked: true,
    };
  }

  const source = readOrderSource();
  const sourceId = Number(source?.companyId);
  if (Number.isFinite(sourceId) && sourceId > 0) {
    return {
      companyId: sourceId,
      companyName: null,
      locked: true,
    };
  }

  return { companyId: null, companyName: null, locked: false };
}
