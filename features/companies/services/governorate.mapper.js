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

/**
 * @param {object} governorate
 * @param {string} [locale]
 */
export function mapGovernorate(governorate, locale = "ar") {
  if (!governorate) return null;

  return {
    id: governorate.id,
    name: mapLocalizedName(governorate, locale),
    nameAr: governorate.name_ar ?? "",
    nameEn: governorate.name_en ?? "",
    rating: toNumberOrNull(
      governorate.average_rating ??
        governorate.avg_rating ??
        governorate.rating,
    ),
    companiesCount: Number(
      governorate.companies_count ??
        governorate.companiesCount ??
        governorate.count ??
        0,
    ),
  };
}

/**
 * Sort governorates: highest company rating → companies count → alphabetical.
 *
 * @param {object[]} governorates
 * @param {string} [locale]
 */
export function sortGovernoratesByRating(governorates = [], locale = "ar") {
  const collator = new Intl.Collator(locale === "ar" ? "ar" : "en", {
    sensitivity: "base",
  });

  return [...governorates].sort((a, b) => {
    const ratingA = a?.rating != null ? Number(a.rating) : null;
    const ratingB = b?.rating != null ? Number(b.rating) : null;

    if (ratingA != null || ratingB != null) {
      const diff = (ratingB ?? -1) - (ratingA ?? -1);
      if (diff !== 0) return diff;
    }

    const countA = Number(a?.companiesCount ?? 0);
    const countB = Number(b?.companiesCount ?? 0);
    if (countA !== countB) return countB - countA;

    return collator.compare(String(a?.name ?? ""), String(b?.name ?? ""));
  });
}

/**
 * Maps + dedupes public governorates by English name (stable unique tabs).
 * Prefers the lowest id when duplicates exist.
 * Sorted by rating → company count → alphabetical when data is available.
 *
 * @param {object[]} governorates
 * @param {string} [locale]
 */
export function mapGovernorates(governorates = [], locale = "ar") {
  const byName = new Map();

  for (const item of governorates) {
    if (!item?.id) continue;

    const key = String(item.name_en ?? item.name_ar ?? item.id).toLowerCase();
    const existing = byName.get(key);
    const mapped = mapGovernorate(item, locale);

    if (!existing || Number(item.id) < Number(existing.id)) {
      byName.set(key, mapped);
    }
  }

  return sortGovernoratesByRating(Array.from(byName.values()), locale);
}
