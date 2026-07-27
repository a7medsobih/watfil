/**
 * Creates a unique idempotency key for order creation.
 */
export function createOrderIdempotencyKey(prefix = "web-order") {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${random}`;
}
