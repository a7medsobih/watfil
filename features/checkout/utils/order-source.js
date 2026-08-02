/**
 * Order source tracking (store share / ads / direct).
 * Per Watafl frontend guide: frontend decides `source` on POST /customer/orders.
 * This is attribution only — it does NOT create a customer↔company link.
 */

const STORAGE_KEY = "watfil_order_source";

export const ORDER_SOURCE_CHANNEL = {
  LINK: "link",
  AD: "ad",
  REFERRAL: "referral",
  DIRECT: "direct",
};

/**
 * @typedef {{
 *   channel: string,
 *   companyId?: number|null,
 *   taxNumber?: string|null,
 *   referenceId?: number|null,
 *   metadata?: Record<string, unknown>,
 * }} StoredOrderSource
 */

/**
 * @returns {StoredOrderSource|null}
 */
export function readOrderSource() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.channel !== "string" || !parsed.channel) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Persist that the visitor entered via a store share link.
 * @param {{ companyId?: string|number|null, taxNumber?: string|null }} params
 */
export function rememberStoreShareSource({ companyId = null, taxNumber = null } = {}) {
  if (typeof window === "undefined") return;

  const id = companyId != null && companyId !== "" ? Number(companyId) : null;
  const tax =
    typeof taxNumber === "string" && taxNumber.trim()
      ? taxNumber.trim()
      : taxNumber != null
        ? String(taxNumber)
        : null;

  /** @type {StoredOrderSource} */
  const value = {
    channel: ORDER_SOURCE_CHANNEL.LINK,
    companyId: Number.isFinite(id) && id > 0 ? id : null,
    taxNumber: tax,
    metadata: {
      entry: "store_share",
      ...(tax ? { tax_number: tax } : {}),
    },
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // private mode / quota — ignore
  }
}

export function clearOrderSource() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Build the `source` object for POST /customer/orders.
 * Defaults to `direct` for normal site entry.
 *
 * @param {string|number|null|undefined} sellerCompanyId
 * @returns {{ channel: string, reference_id?: number, metadata?: Record<string, unknown> }}
 */
export function resolveOrderSourcePayload(sellerCompanyId) {
  const stored = readOrderSource();
  if (!stored) {
    return { channel: ORDER_SOURCE_CHANNEL.DIRECT };
  }

  const sellerId = Number(sellerCompanyId);

  if (stored.channel === ORDER_SOURCE_CHANNEL.LINK) {
    // Only attribute link when ordering from the shared store's company.
    if (
      stored.companyId != null &&
      Number.isFinite(sellerId) &&
      Number(stored.companyId) !== sellerId
    ) {
      return { channel: ORDER_SOURCE_CHANNEL.DIRECT };
    }

    const source = { channel: ORDER_SOURCE_CHANNEL.LINK };
    if (stored.metadata && typeof stored.metadata === "object") {
      source.metadata = stored.metadata;
    } else if (stored.taxNumber) {
      source.metadata = {
        tax_number: stored.taxNumber,
        entry: "store_share",
      };
    }
    return source;
  }

  if (
    stored.channel === ORDER_SOURCE_CHANNEL.AD &&
    stored.referenceId != null &&
    Number.isFinite(Number(stored.referenceId))
  ) {
    return {
      channel: ORDER_SOURCE_CHANNEL.AD,
      reference_id: Number(stored.referenceId),
    };
  }

  return { channel: ORDER_SOURCE_CHANNEL.DIRECT };
}
