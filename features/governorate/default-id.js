import { endpoints } from "@/lib/api/endpoints";
import { buildUrl } from "@/lib/api/client";
import { mapGovernorates } from "@/features/companies/services/governorate.mapper";

/** Process-local cache so proxy redirects do not hit the API every request. */
let cachedId = null;
let cachedAt = 0;
const TTL_MS = 5 * 60 * 1000;

/**
 * Default browse governorate — same ordering as `getGovernorates`.
 * Safe to call from Node proxy / server code.
 *
 * @param {string} [locale]
 * @returns {Promise<string | number | null>}
 */
export async function getDefaultGovernorateId(locale = "ar") {
  if (cachedId != null && Date.now() - cachedAt < TTL_MS) {
    return cachedId;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) return cachedId;

  try {
    const url = buildUrl(endpoints.governorates.list);
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return cachedId;

    const body = await response.json().catch(() => null);
    const mapped = mapGovernorates(body?.data ?? [], locale);
    const id = mapped[0]?.id ?? null;

    if (id != null) {
      cachedId = id;
      cachedAt = Date.now();
    }

    return id;
  } catch {
    return cachedId;
  }
}
