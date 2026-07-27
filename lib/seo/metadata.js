/**
 * Build page metadata for Next.js generateMetadata / metadata exports.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  locale = "en",
  images,
  type = "website",
} = {}) {
  const siteName = "Watfil";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const canonical = `${baseUrl}/${locale}${path === "/" ? "" : path}`;
  const ogImages = images?.map((image) =>
    typeof image === "string" ? { url: image } : image,
  );

  return {
    title: title ? `${title} | ${siteName}` : siteName,
    description: description || siteName,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en${path === "/" ? "" : path}`,
        ar: `${baseUrl}/ar${path === "/" ? "" : path}`,
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
