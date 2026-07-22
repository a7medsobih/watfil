import { Heart, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function CampanyCard({ company, className }) {
  if (!company) return null;

  const coverageItems = company.coverage?.items ?? [];
  const coverageOverflow = company.coverage?.overflow ?? 0;
  const coverageTotal = company.coverage?.total ?? 0;
  const hasLogo = company.hasLogo === true;

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-card",
        className,
      )}
    >
      <Link href={`/companies/${company.slug}`} className="block">
        <div
          className={cn(
            "relative h-44 overflow-hidden",
            hasLogo ? "bg-muted" : "gradient-water",
          )}
        >
          <img
            src={company.logo}
            alt={company.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="space-y-4 p-5">
          <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">
            {company.name}
          </h3>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {company.rating != null && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-warning" />
                <span className="font-semibold">
                  {Number(company.rating).toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({company.reviews ?? 0})
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span>{company.likes ?? 0}</span>
            </div>

            {coverageTotal > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{coverageTotal}</span>
              </div>
            )}
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
        </div>
      </Link>
    </article>
  );
}