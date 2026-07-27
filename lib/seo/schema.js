/**
 * JSON-LD schema helpers.
 */
export function organizationSchema({ name, url, logo } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: name || "Next Template",
    url: url || process.env.NEXT_PUBLIC_SITE_URL,
    logo,
  };
}

export function productSchema({ name, description, image, sku } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    sku,
  };
}

export function breadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
} = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const author = authorName
    ? {
        "@type": "Person",
        name: authorName,
        ...(authorUrl ? { url: authorUrl } : {}),
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image ? [image] : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    author,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url || baseUrl,
    },
  };
}
