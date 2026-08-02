/**
 * Formats a browsing timestamp as a short relative string.
 * Falls back to a compact absolute date when older than ~30 days.
 *
 * @param {string | null | undefined} value
 * @param {string} [locale]
 * @returns {string}
 */
export function formatBrowsingTime(value, locale = "ar") {
  if (!value) return "";

  const date = new Date(String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale === "ar" ? "ar" : "en", {
    numeric: "auto",
  });

  if (Math.abs(diffSec) < 60) return rtf.format(-diffSec, "second");

  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, "minute");

  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) return rtf.format(-diffHour, "hour");

  const diffDay = Math.round(diffHour / 24);
  if (Math.abs(diffDay) < 30) return rtf.format(-diffDay, "day");

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
}
