import { PAYMENT_TYPE } from "@/stores/cart-store";
import { ORDER_SOURCE_CHANNEL } from "@/features/checkout/utils/order-source";

/**
 * Build POST /customer/orders body.
 *
 * `source` is attribution only (store share / ad / direct) — not a
 * customer↔company link mechanism.
 *
 * @param {object} options
 * @param {object} [options.source] Resolved source payload
 *   e.g. `{ channel: "link", metadata?: {...} }` or `{ channel: "direct" }`
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
  source = null,
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

  const channel =
    typeof source?.channel === "string" && source.channel
      ? source.channel
      : ORDER_SOURCE_CHANNEL.DIRECT;

  /** @type {Record<string, unknown>} */
  const sourcePayload = { channel };

  if (source?.reference_id != null && source.reference_id !== "") {
    sourcePayload.reference_id = Number(source.reference_id);
  }
  if (source?.reference_type != null && source.reference_type !== "") {
    sourcePayload.reference_type = source.reference_type;
  }
  if (
    source?.metadata &&
    typeof source.metadata === "object" &&
    Object.keys(source.metadata).length > 0
  ) {
    sourcePayload.metadata = source.metadata;
  }

  const payload = {
    company_id: sellerCompanyId,
    payment_type:
      paymentType === PAYMENT_TYPE.INSTALLMENT
        ? PAYMENT_TYPE.INSTALLMENT
        : PAYMENT_TYPE.CASH,
    items: orderItems,
    source: sourcePayload,
    idempotency_key: idempotencyKey,
  };

  const discountValue = Number(discount) || 0;
  if (discountValue > 0) {
    payload.discount = discountValue;
  }

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
