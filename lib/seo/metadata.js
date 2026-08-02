import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/env";

/**
 * Build a public URL for a locale + path, respecting `localePrefix: 'as-needed'`.
 * Default locale (ar) has no prefix; English is `/en...`.
 */
function localizedUrl(baseUrl, locale, path = "/") {
  const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) {
    return `${baseUrl}${suffix || ""}`;
  }
  return `${baseUrl}/${locale}${suffix}`;
}

/**
 * Build page metadata for Next.js generateMetadata / metadata exports.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  locale = routing.defaultLocale,
  images,
  type = "website",
} = {}) {
  const siteName = "Watfil";
  const baseUrl = getSiteUrl();
  const canonical = localizedUrl(baseUrl, locale, path);
  const ogImages = images?.map((image) =>
    typeof image === "string" ? { url: image } : image,
  );

  return {
    title: title ? `${title} | ${siteName}` : siteName,
    description: description || siteName,
    alternates: {
      canonical,
      languages: {
        ar: localizedUrl(baseUrl, "ar", path),
        en: localizedUrl(baseUrl, "en", path),
        "x-default": localizedUrl(baseUrl, routing.defaultLocale, path),
      },
    },
    openGraph: {
      title: title || siteName,
      description: description || siteName,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      url: canonical,
      siteName,
      type,
      images: ogImages,
    },
    twitter: {
      card: ogImages?.length ? "summary_large_image" : "summary",
      title: title || siteName,
      description: description || siteName,
      images: ogImages?.map((img) => img.url).filter(Boolean),
    },
  };
}
