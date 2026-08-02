/**
 * Maps order API failures to user-facing copy.
 * Never surfaces developer / validation internals in the UI.
 */

const DEV_LEAK_PATTERN =
  /postman|company_id|company_product_id|\bapi\b|validation|laravel|idempotency|sqlstate|stack trace|exception/i;

/**
 * @param {unknown} err
 * @returns {string[]}
 */
function collectErrorTexts(err) {
  const texts = [];
  const data = err?.data;

  if (typeof err?.message === "string" && err.message.trim()) {
    texts.push(err.message.trim());
  }

  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) {
      texts.push(data.message.trim());
    }
    if (typeof data.error === "string" && data.error.trim()) {
      texts.push(data.error.trim());
    }

    const fieldErrors = data.errors;
    if (fieldErrors && typeof fieldErrors === "object") {
      for (const value of Object.values(fieldErrors)) {
        const list = Array.isArray(value) ? value : [value];
        for (const entry of list) {
          if (typeof entry === "string" && entry.trim()) {
            texts.push(entry.trim());
          }
        }
      }
    }
  }

  return texts;
}

/**
 * @param {string} text
 */
function isUserSafeMessage(text) {
  if (!text || DEV_LEAK_PATTERN.test(text)) return false;
  // Laravel field keys / snake_case internals
  if (/^[a-z0-9_]+$/i.test(text) && text.includes("_")) return false;
  return true;
}

/**
 * @param {unknown} err
 * @param {(key: string, values?: Record<string, string>) => string} t
 * @param {{ companyName?: string }} [options]
 */
export function resolveOrderErrorMessage(err, t, options = {}) {
  if (err?.status === 401) return t("errors.auth");

  const companyName = options.companyName || "";
  const texts = collectErrorTexts(err);
  const combined = texts.join(" ");

  if (/غير مرتبط|not linked|not associated|must be linked/i.test(combined)) {
    return t("errors.notLinked", { company: companyName });
  }

  if (
    /غير نشط|inactive|not active|company.*(disabled|suspended)/i.test(combined)
  ) {
    return t("errors.companyInactive");
  }

  if (
    /غير متاح|unavailable|out of stock|not available|product.*(invalid|missing)/i.test(
      combined,
    )
  ) {
    return t("errors.productUnavailable");
  }

  for (const text of texts) {
    if (isUserSafeMessage(text)) return text;
  }

  return t("errors.generic");
}
