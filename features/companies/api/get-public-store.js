import { cache } from "react";

import { fetchFromAPI } from "@/lib/api/fetcher";
import { endpoints } from "@/lib/api/endpoints";
import { cacheTags, companyTag, revalidate } from "@/lib/cache";
import { IMAGE_PLACEHOLDERS } from "@/lib/media/placeholders";

/**
 * Maps GET /public/store/{tax} payload for the share landing page.
 * @param {object} payload
 */
export function mapPublicStore(payload) {
  if (!payload) return null;

  const logo = typeof payload.logo === "string" ? payload.logo.trim() : "";
  const identityImages = Array.isArray(payload.identity_images)
    ? payload.identity_images.filter(
        (url) => typeof url === "string" && url.trim() !== "",
      )
    : [];

  const playStoreUrl =
    payload.play_store_url ||
    payload.android_store_url ||
    "https://play.google.com/store/apps/details?id=com.watfil.client";

  return {
    companyId: payload.company_id ?? null,
    taxNumber: payload.tax_number ?? "",
    name: payload.name ?? "",
    logo: logo || IMAGE_PLACEHOLDERS.company,
    hasLogo: Boolean(logo),
    about: typeof payload.about === "string" ? payload.about.trim() : "",
    identityImages,
    webUrl: payload.web_url ?? "",
    deepLink: payload.deep_link ?? "",
    playStoreUrl,
    androidStoreUrl: payload.android_store_url || playStoreUrl,
  };
}

/**
 * Fetches a public company store share payload by tax number.
 * Returns null on 404 (unavailable / hidden / missing).
 *
 * @param {string} taxNumber
 */
export const getPublicStore = cache(async function getPublicStore(taxNumber) {
  if (taxNumber == null || String(taxNumber).trim() === "") return null;

  const decoded = decodeURIComponent(String(taxNumber)).trim();
  if (!decoded) return null;

  try {
    const response = await fetchFromAPI(endpoints.store.detail(decoded), {
      revalidate: revalidate.medium,
      tags: [cacheTags.companies, companyTag(decoded)],
    });

    const payload = response?.data ?? response;
    return mapPublicStore(payload);
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
});
