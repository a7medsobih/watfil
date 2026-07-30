import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Smart Company Cart — one company per cart (matches POST /customer/orders).
 * Client-only; no backend cart API.
 */

export const PAYMENT_TYPE = {
  CASH: "cash",
  INSTALLMENT: "installment",
};

/** @typedef {'ok'|'company_conflict'|'installment_single'|'installment_blocked'} CartAddStatus */

function sameCompany(companyA, companyB) {
  if (!companyA?.id || !companyB?.id) return false;
  return Number(companyA.id) === Number(companyB.id);
}

function normalizeCompany(company) {
  const id = Number(company?.id);
  if (!Number.isFinite(id) || id <= 0) return null;
  return {
    id,
    name: company.name ?? "",
    slug: String(id),
    logo: company.logo ?? null,
    hasLogo: Boolean(company.hasLogo ?? company.logo),
  };
}

function normalizeItem(item, quantity = 1) {
  const qty = Math.max(1, Number(quantity) || 1);
  const companyProductId = Number(item.companyProductId ?? item.id);
  return {
    companyProductId,
    productId: item.productId ?? item.id,
    companyId:
      item.companyId != null && Number.isFinite(Number(item.companyId))
        ? Number(item.companyId)
        : null,
    name: item.name ?? "",
    image: item.image ?? null,
    price: Number(item.price ?? item.cashPrice ?? 0),
    quantity: qty,
    hasInstallment: Boolean(item.hasInstallment),
    installmentPlans: Array.isArray(item.installmentPlans)
      ? item.installmentPlans
      : [],
    source: item.source ?? "company",
    slug: item.slug ?? null,
  };
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      hasHydrated: false,
      company: null,
      items: [],
      paymentType: PAYMENT_TYPE.CASH,
      installmentPlan: null,
      governorateId: null,
      isMiniCartOpen: false,
      isConflictOpen: false,
      pendingAdd: null,

      setHasHydrated: (hasHydrated = true) => set({ hasHydrated }),

      openMiniCart: () => set({ isMiniCartOpen: true }),
      closeMiniCart: () => set({ isMiniCartOpen: false }),
      setMiniCartOpen: (open) => set({ isMiniCartOpen: Boolean(open) }),

      closeConflict: () =>
        set({ isConflictOpen: false, pendingAdd: null }),

      setGovernorateId: (governorateId) =>
        set({
          governorateId:
            governorateId == null || governorateId === ""
              ? null
              : Number(governorateId),
        }),

      setPaymentType: (paymentType) => {
        const next =
          paymentType === PAYMENT_TYPE.INSTALLMENT
            ? PAYMENT_TYPE.INSTALLMENT
            : PAYMENT_TYPE.CASH;

        if (next === PAYMENT_TYPE.CASH) {
          set({ paymentType: next, installmentPlan: null });
          return { ok: true };
        }

        const { items } = get();
        const totalQty = items.reduce((sum, row) => sum + row.quantity, 0);
        if (items.length > 1 || totalQty > 1) {
          return {
            ok: false,
            reason: "installment_single",
          };
        }

        set({ paymentType: next });
        return { ok: true };
      },

      setInstallmentPlan: (plan) => {
        if (!plan) {
          set({ installmentPlan: null });
          return;
        }
        set({
          paymentType: PAYMENT_TYPE.INSTALLMENT,
          installmentPlan: {
            months: Number(plan.months),
            downPayment: Number(plan.downPayment ?? plan.down_payment ?? 0),
            installmentAmount: Number(
              plan.installmentAmount ?? plan.installment_amount ?? 0,
            ),
          },
        });
      },

      /**
       * Attempt to add a product. Never silently drops another company's cart.
       * @returns {{ status: CartAddStatus, messageKey?: string }}
       */
      requestAdd: ({ company, item, quantity = 1, openCart = true } = {}) => {
        const nextCompany = normalizeCompany(company);
        const nextItem = normalizeItem(item, quantity);
        if (!nextCompany || !nextItem.companyProductId) {
          return { status: "ok" };
        }

        const state = get();

        if (state.company && !sameCompany(state.company, nextCompany)) {
          set({
            isConflictOpen: true,
            pendingAdd: {
              company: nextCompany,
              item: nextItem,
              openCart,
            },
          });
          return { status: "company_conflict" };
        }

        if (state.paymentType === PAYMENT_TYPE.INSTALLMENT) {
          const existingOther = state.items.find(
            (row) => row.companyProductId !== nextItem.companyProductId,
          );
          const existingSame = state.items.find(
            (row) => row.companyProductId === nextItem.companyProductId,
          );
          if (existingOther || (existingSame && existingSame.quantity >= 1)) {
            return {
              status: "installment_single",
              messageKey: "cart.toast.installmentSingle",
            };
          }
        }

        if (
          state.items.length > 0 &&
          nextItem.hasInstallment === false &&
          state.paymentType === PAYMENT_TYPE.INSTALLMENT
        ) {
          return {
            status: "installment_blocked",
            messageKey: "cart.toast.installmentBlocked",
          };
        }

        get().commitAdd({
          company: nextCompany,
          item: nextItem,
          openCart,
        });
        return { status: "ok" };
      },

      /** Force-replace cart with pending (or provided) add after user confirms. */
      confirmReplaceAndAdd: () => {
        const { pendingAdd } = get();
        if (!pendingAdd) return;
        set({
          company: null,
          items: [],
          paymentType: PAYMENT_TYPE.CASH,
          installmentPlan: null,
          isConflictOpen: false,
          pendingAdd: null,
        });
        get().commitAdd(pendingAdd);
      },

      keepCurrentCart: () => {
        set({ isConflictOpen: false, pendingAdd: null, isMiniCartOpen: true });
      },

      commitAdd: ({ company, item, openCart = true }) => {
        const nextCompany = normalizeCompany(company);
        const nextItem = normalizeItem(item, item.quantity ?? 1);
        if (!nextCompany || !nextItem.companyProductId) return;

        set((state) => {
          const existing = state.items.find(
            (row) => row.companyProductId === nextItem.companyProductId,
          );

          let items;
          if (existing) {
            items = state.items.map((row) =>
              row.companyProductId === nextItem.companyProductId
                ? {
                    ...row,
                    quantity:
                      state.paymentType === PAYMENT_TYPE.INSTALLMENT
                        ? 1
                        : row.quantity + nextItem.quantity,
                  }
                : row,
            );
          } else {
            items = [...state.items, nextItem];
          }

          return {
            company: nextCompany,
            items,
            isMiniCartOpen: openCart ? true : state.isMiniCartOpen,
            isConflictOpen: false,
            pendingAdd: null,
          };
        });
      },

      remove: (companyProductId) =>
        set((state) => {
          const items = state.items.filter(
            (row) => row.companyProductId !== Number(companyProductId),
          );
          if (items.length === 0) {
            return {
              items: [],
              company: null,
              paymentType: PAYMENT_TYPE.CASH,
              installmentPlan: null,
            };
          }
          return { items };
        }),

      increase: (companyProductId) => {
        const { paymentType } = get();
        if (paymentType === PAYMENT_TYPE.INSTALLMENT) {
          return { ok: false, reason: "installment_single" };
        }
        set((state) => ({
          items: state.items.map((row) =>
            row.companyProductId === Number(companyProductId)
              ? { ...row, quantity: row.quantity + 1 }
              : row,
          ),
        }));
        return { ok: true };
      },

      decrease: (companyProductId) =>
        set((state) => {
          const items = state.items
            .map((row) =>
              row.companyProductId === Number(companyProductId)
                ? { ...row, quantity: row.quantity - 1 }
                : row,
            )
            .filter((row) => row.quantity > 0);

          if (items.length === 0) {
            return {
              items: [],
              company: null,
              paymentType: PAYMENT_TYPE.CASH,
              installmentPlan: null,
            };
          }
          return { items };
        }),

      clear: () =>
        set({
          company: null,
          items: [],
          paymentType: PAYMENT_TYPE.CASH,
          installmentPlan: null,
          governorateId: null,
          pendingAdd: null,
          isConflictOpen: false,
        }),

      uniqueCount: () => get().items.length,

      count: () =>
        get().items.reduce((total, entry) => total + entry.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (total, entry) => total + (entry.price ?? 0) * entry.quantity,
          0,
        ),

      total: () => get().subtotal(),
    }),
    {
      name: "watfil-company-cart-v2",
      partialize: (state) => ({
        company: state.company,
        items: state.items,
        paymentType: state.paymentType,
        installmentPlan: state.installmentPlan,
        governorateId: state.governorateId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
