import {
  EXPERIENCE,
  EXPERIENCE_QUERY_KEY,
} from "@/features/experience/constants";

/**
 * @param {Record<string, string | string[] | undefined> | URLSearchParams | null | undefined} searchParams
 * @returns {"website"|"campaign"}
 */
export function resolveExperience(searchParams) {
  if (!searchParams) return EXPERIENCE.WEBSITE;

  let raw;
  if (typeof searchParams.get === "function") {
    raw = searchParams.get(EXPERIENCE_QUERY_KEY);
  } else {
    const value = searchParams[EXPERIENCE_QUERY_KEY];
    raw = Array.isArray(value) ? value[0] : value;
  }

  return raw === EXPERIENCE.CAMPAIGN
    ? EXPERIENCE.CAMPAIGN
    : EXPERIENCE.WEBSITE;
}

export function isCampaignExperience(experience) {
  return experience === EXPERIENCE.CAMPAIGN;
}

/**
 * Appends or strips `experience=campaign` on an href.
 * Does not touch other query params. Canonical path stays unchanged.
 *
 * @param {string} href
 * @param {"website"|"campaign"|null|undefined} experience
 */
export function withExperience(href, experience) {
  if (!href) return href;

  const [pathAndHash, existingQuery = ""] = String(href).split("?");
  const [path, hash = ""] = pathAndHash.split("#");
  const query = new URLSearchParams(existingQuery);

  if (experience === EXPERIENCE.CAMPAIGN) {
    query.set(EXPERIENCE_QUERY_KEY, EXPERIENCE.CAMPAIGN);
  } else {
    query.delete(EXPERIENCE_QUERY_KEY);
  }

  const qs = query.toString();
  const hashPart = hash ? `#${hash}` : "";
  return qs ? `${path}?${qs}${hashPart}` : `${path}${hashPart}`;
}

/**
 * Builds a company profile href that stays inside the current experience.
 *
 * @param {string|number} companyId
 * @param {"website"|"campaign"} [experience]
 */
export function buildCompanyExperienceHref(
  companyId,
  experience = EXPERIENCE.WEBSITE,
) {
  const base = `/companies/${encodeURIComponent(String(companyId))}`;
  return withExperience(base, experience);
}
