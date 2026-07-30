import { mapProduct } from "@/features/products/services/product.mapper";
import { LIKE_SOURCE } from "@/features/wishlist/types";
import { toCompanyRouteId } from "@/features/companies/utils/company-slug";
import { mapGovernorate } from "@/features/companies/services/governorate.mapper";
import { IMAGE_PLACEHOLDERS } from "@/lib/media/placeholders";

const COMPANY_LOGO_PLACEHOLDER = IMAGE_PLACEHOLDERS.company;
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

/**
 * Unique coverage governorates for badge display (list cards).
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
 * Full coverage chips for the company store (governorates + cities).
 */
function mapCoverageAreas(coverage = [], locale = "ar") {
  const seen = new Set();
  const items = [];

  for (const entry of coverage ?? []) {
    const city = entry?.city;
    const governorate = entry?.governorate;

    if (city?.id) {
      const name = mapLocalizedName(city, locale);
      const key = `city:${city.id}:${name}`.toLowerCase();
      if (name && !seen.has(key)) {
        seen.add(key);
        items.push({
          id: `city-${city.id}`,
          name,
          type: "city",
          governorateId: governorate?.id ?? city.governorate_id ?? null,
        });
      }
    }

    if (governorate?.id) {
      const name = mapLocalizedName(governorate, locale);
      const key = `gov:${governorate.id}:${name}`.toLowerCase();
      if (name && !seen.has(key)) {
        seen.add(key);
        items.push({
          id: `gov-${governorate.id}`,
          name,
          type: "governorate",
          governorateId: governorate.id,
        });
      }
    }
  }

  return items;
}

function mapGallery(gallery = []) {
  return [...(gallery ?? [])]
    .filter((item) => item?.url)
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    .map((item) => ({
      id: item.id,
      url: item.url,
      sortOrder: Number(item.sort_order ?? 0),
    }));
}

function mapServices(services = []) {
  return [...(services ?? [])]
    .filter((item) => item?.title)
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    .map((item) => ({
      id: item.id,
      title: item.title ?? "",
      description: item.description ?? "",
      icon: item.icon ?? null,
      sortOrder: Number(item.sort_order ?? 0),
    }));
}

function mapTeam(team = []) {
  return [...(team ?? [])]
    .filter((member) => member?.name)
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    .map((member) => ({
      id: member.id ?? member.name,
      name: member.name ?? "",
      role: member.role ?? member.job_title ?? "",
      photo: member.photo ?? member.image ?? null,
      sortOrder: Number(member.sort_order ?? 0),
    }));
}

function mapRatings(ratings = []) {
  return [...(ratings ?? [])]
    .filter((item) => item?.id != null || item?.rating != null)
    .map((item) => ({
      id: item.id,
      rating: Number(item.rating ?? 0),
      comment:
        typeof item.comment === "string" && item.comment.trim()
          ? item.comment.trim()
          : null,
      customer: item.customer
        ? {
            id: item.customer.id,
            fullName: item.customer.full_name ?? null,
          }
        : null,
      createdAt: item.created_at ?? null,
      updatedAt: item.updated_at ?? null,
    }));
}

/**
 * Maps company-store products and attaches like source/company context.
 *
 * @param {object[]} [products]
 * @param {string|number} [companyId]
 * @param {string} [locale]
 */
export function mapCompanyProducts(products = [], companyId, locale = "ar") {
  return (products ?? [])
    .map((product) => {
      const mapped = mapProduct(product, locale);
      if (!mapped) return null;

      const source =
        product.source === LIKE_SOURCE.CATALOG
          ? LIKE_SOURCE.CATALOG
          : product.source === LIKE_SOURCE.COMPANY
            ? LIKE_SOURCE.COMPANY
            : mapped.source === LIKE_SOURCE.CATALOG
              ? LIKE_SOURCE.CATALOG
              : LIKE_SOURCE.COMPANY;

      const isCompanyProduct = source === LIKE_SOURCE.COMPANY;

      return {
        ...mapped,
        source,
        likeSource: source,
        companyId: isCompanyProduct ? (companyId ?? mapped.companyId) : null,
      };
    })
    .filter(Boolean);
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
  const name = company.name ?? "";

  return {
    id: company.id,
    // Temporary: route key is numeric id until backend supports slug.
    slug: toCompanyRouteId(company.id),
    name,
    logo: hasLogo ? company.logo : COMPANY_LOGO_PLACEHOLDER,
    hasLogo,
    rating: toNumberOrNull(company.average_rating),
    reviews: Number(company.ratings_count ?? 0),
    likes: Number(company.likes_count ?? 0),
    viewsCount: Number(company.views_count ?? 0),
    governorate: mapGovernorate(company.governorate, locale),
    coverage,
    coversAllGovernorates: Boolean(company.covers_all_governorates),
    isListingAd: Boolean(company.is_listing_ad),
    listingAdPosition:
      company.listing_ad_position != null
        ? Number(company.listing_ad_position)
        : null,
    verified: Boolean(company.is_verified ?? company.verified),
  };
}

/**
 * Full company store model (detail endpoint).
 * @param {object} company
 * @param {string} [locale]
 */
export function mapCompanyDetail(company, locale = "ar") {
  const base = mapCompany(company, locale);
  if (!base) return null;

  const about =
    typeof company.about === "string" && company.about.trim()
      ? company.about.trim()
      : null;

  return {
    ...base,
    about,
    viewsCount: Number(company.views_count ?? 0),
    productsCount: Number(company.products_count ?? 0),
    isLiked: Boolean(company.is_liked),
    myRating: toNumberOrNull(company.my_rating),
    gallery: mapGallery(company.gallery),
    services: mapServices(company.services),
    team: mapTeam(company.team),
    ratings: mapRatings(company.ratings),
    coverageAreas: mapCoverageAreas(company.coverage ?? [], locale),
    // Products load via GET /public/companies/{id}/products — not embedded here.
    products: [],
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

export {
  mapGovernorates,
  sortGovernoratesByRating,
} from "./governorate.mapper";
