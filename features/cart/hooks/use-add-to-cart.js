"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { resolveCompanyIdFromParam } from "@/features/companies/utils/company-slug";
import { useCartStore } from "@/stores/cart-store";

/**
 * Resolve the numeric company id the customer is buying from.
 * Never use product/catalog ids here — orders require the seller company_id.
 */
function resolveSellingCompanyId(company) {
  if (!company) return null;

  const fromId = Number(company.id);
  if (Number.isFinite(fromId) && fromId > 0) return fromId;

  const fromSlug = resolveCompanyIdFromParam(company.slug);
  const parsed = Number(fromSlug);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;

  return null;
}

/**
 * Shared add-to-cart handler with friendly toasts for business rules.
 */
export function useAddToCart() {
  const t = useTranslations("cart");
  const requestAdd = useCartStore((state) => state.requestAdd);

  const addToCart = ({ company, product, quantity = 1, openCart = true } = {}) => {
    if (!company || !product) return { status: "ok" };

    const sellingCompanyId = resolveSellingCompanyId(company);
    if (!sellingCompanyId) {
      toast.error(t("toast.missingCompany"));
      return { status: "ok" };
    }

    const companyProductId = Number(
      product.companyProductId ?? product.id,
    );
    if (!Number.isFinite(companyProductId) || companyProductId <= 0) {
      toast.error(t("toast.missingProduct"));
      return { status: "ok" };
    }

    const result = requestAdd({
      company: {
        ...company,
        // Force numeric seller company_id for POST /customer/orders
        id: sellingCompanyId,
      },
      item: {
        id: companyProductId,
        companyProductId,
        productId: product.id,
        companyId: sellingCompanyId,
        name: product.name,
        image: product.image,
        price: product.cashPrice,
        cashPrice: product.cashPrice,
        hasInstallment: product.hasInstallment,
        installmentPlans: product.installmentPlans,
        source: product.source ?? product.likeSource ?? "company",
        slug: product.slug,
      },
      quantity,
      openCart,
    });

    if (result.status === "ok") {
      toast.success(t("toast.added"));
    } else if (result.status === "installment_single") {
      toast.message(t("toast.installmentSingle"));
    } else if (result.status === "installment_blocked") {
      toast.message(t("toast.installmentBlocked"));
    }

    return result;
  };

  return { addToCart };
}
