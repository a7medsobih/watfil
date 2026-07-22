import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/request";

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
  return apiRequest(endpoints.auth.checkPhone, {
    method: "POST",
    body: JSON.stringify({ phone: normalizePhone(phone) }),
  });
}

export async function loginCustomer({ phone, password }) {
  return apiRequest(endpoints.auth.login, {
    method: "POST",
    body: JSON.stringify({
      phone: normalizePhone(phone),
      password,
    }),
  });
}

export async function requestRegisterOtp(phone) {
  return apiRequest(endpoints.auth.requestOtp, {
    method: "POST",
    body: JSON.stringify({ phone: normalizePhone(phone) }),
  });
}

export async function verifyRegister(payload) {
  return apiRequest(endpoints.auth.verifyRegister, {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      phone: normalizePhone(payload.phone),
    }),
  });
}

export async function logoutCustomer(token) {
  return apiRequest(endpoints.auth.logout, {
    method: "POST",
    token,
  });
}

export async function getCustomerMe(token) {
  return apiRequest(endpoints.auth.me, {
    method: "GET",
    token,
  });
}

export async function updateCustomerProfile(token, payload) {
  return apiRequest(endpoints.auth.profile, {
    method: "PATCH",
    token,
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
