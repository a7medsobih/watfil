/**
 * Build page metadata for Next.js generateMetadata / metadata exports.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  locale = "en",
  images,
} = {}) {
  const siteName = "Next Template";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: title ? `${title} | ${siteName}` : siteName,
    description: description || siteName,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        en: `${baseUrl}/en${path === "/" ? "" : path}`,
        ar: `${baseUrl}/ar${path === "/" ? "" : path}`,
      },
    },
    openGraph: {
      title: title || siteName,
      description: description || siteName,
      locale,
      url: `${baseUrl}${path}`,
      siteName,
      images,
    },
  };
}
