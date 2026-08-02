import { endpoints } from "@/lib/api/endpoints";
import { fetchFromAPI } from "@/lib/api/fetcher";

/**
 * Normalize Egyptian mobile numbers to digits starting with 01…
 */
export function normalizePhone(value = "") {
  const digits = String(value).replace(/\D/g, "");
  if (digits.startsWith("20") && digits.length >= 12) {
    return `0${digits.slice(2)}`;
  }
  return digits;
}

export function isValidEgyptianPhone(phone) {
  return /^01[0125]\d{8}$/.test(normalizePhone(phone));
}

export async function checkPhone(phone) {
  return fetchFromAPI(endpoints.auth.checkPhone, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify({ phone: normalizePhone(phone) }),
  });
}

export async function loginCustomer({ phone, password, sessionKey } = {}) {
  const body = {
    phone: normalizePhone(phone),
    password,
  };

  if (sessionKey) {
    body.session_key = sessionKey;
  }

  return fetchFromAPI(endpoints.auth.login, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(body),
  });
}

/**
 * Direct customer register (POST /customer/register).
 * Pass `company_id` to create an active customer_company_links row
 * (required before POST /customer/orders).
 *
 * @param {object} payload
 * @param {string} payload.phone
 * @param {string} payload.password
 * @param {string} payload.password_confirmation
 * @param {string} payload.full_name
 * @param {number} payload.governorate_id
 * @param {number} payload.company_id
 * @param {string} [payload.referral_code]
 */
export async function registerCustomer(payload = {}) {
  const companyId = Number(payload.company_id);
  if (!Number.isFinite(companyId) || companyId <= 0) {
    const error = new Error("company_id_required");
    error.status = 422;
    throw error;
  }

  const body = {
    phone: normalizePhone(payload.phone),
    password: payload.password,
    password_confirmation: payload.password_confirmation,
    full_name: payload.full_name,
    governorate_id: Number(payload.governorate_id),
    company_id: companyId,
  };

  if (payload.referral_code) {
    body.referral_code = String(payload.referral_code).trim();
  }

  return fetchFromAPI(endpoints.auth.register, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(body),
  });
}

export async function requestRegisterOtp(phone) {
  return fetchFromAPI(endpoints.auth.requestOtp, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify({ phone: normalizePhone(phone) }),
  });
}

export async function verifyRegister(payload) {
  const { sessionKey, session_key, ...rest } = payload ?? {};
  const body = {
    ...rest,
    phone: normalizePhone(payload?.phone),
  };

  const mergeKey = session_key || sessionKey;
  if (mergeKey) {
    body.session_key = mergeKey;
  }

  return fetchFromAPI(endpoints.auth.verifyRegister, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(body),
  });
}

export async function logoutCustomer(token) {
  return fetchFromAPI(endpoints.auth.logout, {
    method: "POST",
    token,
    cache: "no-store",
  });
}

export async function getCustomerMe(token) {
  return fetchFromAPI(endpoints.auth.me, {
    method: "GET",
    token,
    cache: "no-store",
  });
}

export async function updateCustomerProfile(token, payload) {
  return fetchFromAPI(endpoints.auth.profile, {
    method: "PATCH",
    token,
    cache: "no-store",
    body: JSON.stringify(payload),
  });
}

/**
 * Extract session fields from login / verify responses.
 */
export function extractSession(response) {
  const data = response?.data ?? response ?? {};
  const token =
    data.token ||
    data.access_token ||
    response?.token ||
    response?.access_token ||
    null;

  const user =
    data.customer ||
    data.user ||
    data.profile ||
    (data.id || data.phone || data.name || data.full_name ? data : null);

  return { token, user, raw: response };
}

export function getFieldError(error, field) {
  const errors = error?.errors;
  if (!errors || typeof errors !== "object") return null;
  const value = errors[field];
  if (Array.isArray(value)) return value[0] || null;
  if (typeof value === "string") return value;
  return null;
}
