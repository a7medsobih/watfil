import { buildUrl } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

/**
 * Proxies the backend sitemap.xml for SEO crawlers.
 */
export async function GET() {
  const url = buildUrl(endpoints.seo.sitemap);

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return new Response("Sitemap not available", { status: 502 });
    }

    const xml = await response.text();

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch {
    return new Response("Sitemap not available", { status: 502 });
  }
}
