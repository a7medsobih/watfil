/**
 * Local placeholder artwork used whenever the backend returns `null`
 * (or a broken URL) for an image. Kept as lightweight inline SVG so the
 * browser never pays for a failed network request.
 */
export const IMAGE_PLACEHOLDERS = {
  product: "/images/product-placeholder.svg",
  company: "/images/company-placeholder.svg",
  article: "/images/blog-placeholder.svg",
};

/**
 * @param {keyof typeof IMAGE_PLACEHOLDERS} [kind]
 */
export function getImagePlaceholder(kind = "product") {
  return IMAGE_PLACEHOLDERS[kind] ?? IMAGE_PLACEHOLDERS.product;
}

/**
 * Returns the backend image when usable, otherwise the local placeholder.
 *
 * @param {unknown} src
 * @param {keyof typeof IMAGE_PLACEHOLDERS} [kind]
 */
export function resolveImageSrc(src, kind = "product") {
  if (typeof src === "string" && src.trim() !== "") return src;
  return getImagePlaceholder(kind);
}
