import { Heart, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { buildCompanyProductHref } from "@/features/companies/utils/resolve-company-product-params";
import { resolveLucideIcon } from "@/features/companies/utils/resolve-lucide-icon";
import { cn } from "@/lib/utils";

/**
 * Company card for a product offering in a governorate.
 * Links to that company's full product-details page.
 */
export default function ProductOfferingCompanyCard({
  offering,
  locale = "ar",
  className,
  labels = {},
}) {
  if (!offering?.company) return null;

  const { company, product } = offering;
  const currency = locale === "ar" ? "ج.م" : "EGP";
  const coverageItems = company.coverage?.items ?? [];
  const coverageOverflow = company.coverage?.overflow ?? 0;
  const perks = product?.hasPerks ? (product.perks ?? []).slice(0, 3) : [];

  const showSalePrice =
    product?.isOnSale &&
    product.originalPrice != null &&
    product.originalPrice > product.cashPrice;

  const href = product?.id
    ? buildCompanyProductHref(company.slug, product.id, {
        source: product.source ?? product.likeSource ?? "catalog",
      })
    : `/companies/${company.slug}`;

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card",
        className,
      )}
    >
      <Link href={href} className="block">
        <div
          className={cn(
            "relative h-40 overflow-hidden",
            company.hasLogo ? "bg-muted" : "gradient-water",
          )}
        >
          <img
            src={company.logo}
            alt={company.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />

          <div className="absolute start-3 top-3 flex flex-wrap gap-2">
            {company.verified && (
              <Badge className="rounded-full">
                {labels.verified ?? "Verified"}
              </Badge>
            )}
            {product?.hasInstallment && (
              <Badge className="rounded-full">
                {labels.installment ?? "Installment"}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">
              {company.name}
            </h3>
            {company.governorate?.name && (
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                {company.governorate.name}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {company.rating != null && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-warning" aria-hidden />
                <span className="font-semibold">
                  {Number(company.rating).toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({company.reviews ?? 0})
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Heart className="h-4 w-4" aria-hidden />
              <span>{company.likes ?? 0}</span>
            </div>
          </div>

          {coverageItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {coverageItems.map((item) => (
                <Badge
                  key={item.id}
                  variant="secondary"
                  className="rounded-full bg-primary/10 text-primary hover:bg-primary/15"
                >
                  {item.name}
                </Badge>
              ))}
              {coverageOverflow > 0 && (
                <Badge
                  variant="secondary"
                  className="rounded-full bg-primary/10 text-primary hover:bg-primary/15"
                >
                  +{coverageOverflow}
                </Badge>
              )}
            </div>
          )}

          {product && (
            <div className="border-t border-border/60 pt-4">
              <div className="text-xs text-muted-foreground">
                {labels.price ?? "Price"}
              </div>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-xl font-bold text-primary">
                  {product.cashPrice.toLocaleString(
                    locale === "ar" ? "ar-EG" : "en-EG",
                  )}
                </span>
                <span className="text-sm text-muted-foreground">{currency}</span>
                {showSalePrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString(
                      locale === "ar" ? "ar-EG" : "en-EG",
                    )}
                  </span>
                )}
              </div>

              {perks.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {perks.map((perk) => {
                    const Icon = resolveLucideIcon(perk.icon);
                    return (
                      <span
                        key={perk.id ?? `${perk.title}-${perk.icon}`}
                        title={perk.title}
                        className="inline-flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary"
                      >
                        <Icon className="size-3.5" aria-hidden />
                        <span className="sr-only">{perk.title}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
