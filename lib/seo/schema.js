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
