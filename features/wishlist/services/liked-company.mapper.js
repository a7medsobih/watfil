import { mapCompany } from "@/features/companies/services/company.mapper";

/**
 * Normalizes a liked-company row from GET /customer/likes (or /likes/companies).
 * Shape: `{ liked_at, company: { id, name, is_liked, average_rating, … } }`
 */
export function mapLikedCompany(item, locale = "ar") {
  if (!item) return null;

  const nested = item.company ?? item;
  const company = mapCompany(nested, locale);
  if (!company) return null;

  return {
    ...company,
    isLiked: true,
    rating:
      nested.average_rating != null
        ? Number(nested.average_rating)
        : company.rating,
    likes: Number(
      nested.likes_count ?? item.likes_count ?? company.likes ?? 0,
    ),
    likedAt: item.liked_at ?? null,
  };
}

export function mapLikedCompanies(items = [], locale = "ar") {
  return items.map((item) => mapLikedCompany(item, locale)).filter(Boolean);
}
