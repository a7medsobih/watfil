"use client";

import { useTranslations } from "next-intl";

import { useCompanyBrand } from "@/features/companies/context/company-brand-context";
import { useExperience } from "@/features/experience";
import { buildCompanyExperienceHref } from "@/features/experience/utils";
import { Link } from "@/i18n/navigation";

/**
 * Campaign footer — company brand + copyright only (no Watfil, no links).
 * Brand comes solely from CompanyBrandContext.
 */
export default function CampaignFooter() {
  const t = useTranslations();
  const brand = useCompanyBrand();
  const { experience } = useExperience();
  const year = new Date().getFullYear();

  const href = brand?.slug
    ? buildCompanyExperienceHref(brand.slug, experience)
    : null;

  return (
    <footer className="mt-auto border-t border-border/60 bg-surface">
      <div className="container flex flex-col items-center justify-between gap-3 py-6 sm:flex-row sm:py-7">
        {brand?.name ? (
          href ? (
            <Link
              href={href}
              className="flex min-w-0 items-center gap-2"
              aria-label={brand.name}
            >
              {brand.hasLogo && brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  width={36}
                  height={36}
                  className="size-8 shrink-0 rounded-lg object-cover"
                />
              ) : null}
              <span className="truncate text-sm font-semibold tracking-tight">
                {brand.name}
              </span>
            </Link>
          ) : (
            <div className="flex min-w-0 items-center gap-2">
              {brand.hasLogo && brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  width={36}
                  height={36}
                  className="size-8 shrink-0 rounded-lg object-cover"
                />
              ) : null}
              <span className="truncate text-sm font-semibold tracking-tight">
                {brand.name}
              </span>
            </div>
          )
        ) : (
          <span className="sr-only">{t("brand.name")}</span>
        )}

        <p className="text-center text-xs text-muted-foreground sm:text-start">
          © {year}
          {brand?.name ? ` ${brand.name}.` : ""} {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
