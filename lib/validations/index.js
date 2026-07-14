/**
 * Shared validation helpers (placeholders for form/API validation).
 */
export function required(value, message = "Required") {
  if (value == null || String(value).trim() === "") {
    return message;
  }
  return null;
}

export function isEmail(value, message = "Invalid email") {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""))) {
    return message;
  }
  return null;
}
