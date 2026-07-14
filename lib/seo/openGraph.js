/**
 * Open Graph helpers.
 */
export function buildOpenGraph({
  title,
  description,
  url,
  images = [],
  type = "website",
  locale = "en_US",
} = {}) {
  return {
    title,
    description,
    url,
    type,
    locale,
    images: images.map((image) =>
      typeof image === "string" ? { url: image } : image
    ),
  };
}
