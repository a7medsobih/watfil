/**
 * Formats an ISO date string for display in the given locale.
 * @param {string | null | undefined} date
 * @param {string} [locale]
 */
export function formatDate(date, locale = "en") {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}
