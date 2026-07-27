import { PAYMENT_TYPE } from "@/stores/cart-store";

/**
 * Build POST /customer/orders body.
 *
 * Matches working Postman + docs §3.10:
 * company_id = seller company the customer buys from.
 */
export function buildOrderPayload({
  companyId,
  items,
  paymentType = PAYMENT_TYPE.CASH,
  installmentPlan = null,
  governorateId = null,
  notes = "",
  idempotencyKey,
  discount = 0,
  sourceChannel = "link",
}) {
  const sellerCompanyId = Number(companyId);
  if (!Number.isFinite(sellerCompanyId) || sellerCompanyId <= 0) {
    throw new Error("invalid_company_id");
  }

  const orderItems = (items ?? []).map((item) => {
    const companyProductId = Number(item.companyProductId);
    if (!Number.isFinite(companyProductId) || companyProductId <= 0) {
      throw new Error("invalid_company_product_id");
    }
    return {
      company_product_id: companyProductId,
      quantity: Math.max(1, Number(item.quantity) || 1),
    };
  });

  if (orderItems.length === 0) {
    throw new Error("empty_items");
  }

  // Keep shape aligned with Postman / docs so backend link rules apply.
  const payload = {
    company_id: sellerCompanyId,
    payment_type:
      paymentType === PAYMENT_TYPE.INSTALLMENT
        ? PAYMENT_TYPE.INSTALLMENT
        : PAYMENT_TYPE.CASH,
    items: orderItems,
    discount: Number(discount) || 0,
    idempotency_key: idempotencyKey,
    source: {
      channel: sourceChannel || "link",
      reference_type: null,
      reference_id: null,
      metadata: {},
    },
  };

  if (governorateId != null && governorateId !== "") {
    payload.governorate_id = Number(governorateId);
  }

  const trimmedNotes = notes?.trim?.() ? notes.trim() : "";
  if (trimmedNotes) {
    payload.notes = trimmedNotes;
  }

  if (payload.payment_type === PAYMENT_TYPE.INSTALLMENT) {
    if (!installmentPlan) {
      throw new Error("installment_plan_required");
    }
    if (payload.items.length !== 1 || payload.items[0].quantity !== 1) {
      throw new Error("installment_single_item");
    }
    // Never send installment_plan with cash (backend rule).
    payload.installment_plan = {
      months: Number(installmentPlan.months),
      down_payment: Number(
        installmentPlan.downPayment ?? installmentPlan.down_payment ?? 0,
      ),
      installment_amount: Number(
        installmentPlan.installmentAmount ??
          installmentPlan.installment_amount ??
          0,
      ),
    };
  }

  return payload;
}
