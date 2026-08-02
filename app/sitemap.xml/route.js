import { buildUrl } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

export const runtime = "nodejs";
export const maxDuration = 20;

const SITEMAP_TIMEOUT_MS = 12_000;

/**
 * Proxies the backend sitemap.xml for SEO crawlers.
 */
export async function GET() {
  const url = buildUrl(endpoints.seo.sitemap);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SITEMAP_TIMEOUT_MS);
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) {
      console.error(`[sitemap] upstream ← ${response.status}`);
      return new Response("Sitemap not available", { status: 502 });
    }

    const xml = await response.text();

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (cause) {
    console.error("[sitemap] fetch failed", cause?.message);
    return new Response("Sitemap not available", { status: 502 });
  }
}
