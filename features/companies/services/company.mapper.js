const COMPANY_LOGO_PLACEHOLDER = "/images/company-placeholder.svg";
const COVERAGE_BADGE_LIMIT = 3;

function toNumberOrNull(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function mapLocalizedName(entity, locale = "ar") {
  if (!entity) return "";
  if (locale === "en") {
    return entity.name_en ?? entity.name_ar ?? entity.name ?? "";
  }
  return entity.name_ar ?? entity.name_en ?? entity.name ?? "";
}

function mapGovernorate(governorate, locale = "ar") {
  if (!governorate) return null;

  return {
    id: governorate.id,
    name: mapLocalizedName(governorate, locale),
    nameAr: governorate.name_ar ?? "",
    nameEn: governorate.name_en ?? "",
  };
}

/**
 * Unique coverage governorates for badge display.
 */
function mapCoverage(coverage = [], locale = "ar") {
  const seen = new Set();
  const items = [];

  for (const entry of coverage) {
    const governorate = entry?.governorate;
    if (!governorate?.id) continue;

    const key = String(
      governorate.name_en ?? governorate.name_ar ?? governorate.id,
    ).toLowerCase();

    if (seen.has(key)) continue;
    seen.add(key);

    items.push({
      id: governorate.id,
      name: mapLocalizedName(governorate, locale),
    });
  }

  const visible = items.slice(0, COVERAGE_BADGE_LIMIT);
  const overflow = Math.max(0, items.length - visible.length);

  return { items: visible, overflow, total: items.length };
}

/**
 * Converts a backend company into the stable Company Model used by the UI.
 * @param {object} company
 * @param {string} [locale]
 */
export function mapCompany(company, locale = "ar") {
  if (!company) return null;

  const coverage = mapCoverage(company.coverage ?? [], locale);

  const hasLogo = Boolean(company.logo);

  return {
    id: company.id,
    slug: String(company.slug ?? company.id),
    name: company.name ?? "",
    logo: hasLogo ? company.logo : COMPANY_LOGO_PLACEHOLDER,
    hasLogo,
    rating: toNumberOrNull(company.average_rating),
    reviews: Number(company.ratings_count ?? 0),
    likes: Number(company.likes_count ?? 0),
    governorate: mapGovernorate(company.governorate, locale),
    coverage,
    verified: Boolean(company.is_verified ?? company.verified),
  };
}

export function mapCompanies(companies = [], locale = "ar") {
  return companies.map((company) => mapCompany(company, locale)).filter(Boolean);
}

export function mapCompaniesMeta(meta) {
  return {
    total: meta?.total ?? 0,
    currentPage: meta?.current_page ?? 1,
    lastPage: meta?.last_page ?? 1,
    perPage: meta?.per_page ?? 15,
  };
}

/**
 * Maps + dedupes public governorates by English name (stable unique tabs).
 * Prefers the lowest id when duplicates exist.
 */
export function mapGovernorates(governorates = [], locale = "ar") {
  const byName = new Map();

  for (const item of governorates) {
    if (!item?.id) continue;

    const key = String(item.name_en ?? item.name_ar ?? item.id).toLowerCase();
    const existing = byName.get(key);

    if (!existing || Number(item.id) < Number(existing.id)) {
      byName.set(key, {
        id: item.id,
        name: mapLocalizedName(item, locale),
        nameAr: item.name_ar ?? "",
        nameEn: item.name_en ?? "",
      });
    }
  }

  return Array.from(byName.values()).sort((a, b) => Number(a.id) - Number(b.id));
}
