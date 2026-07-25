"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Package } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import ProductCard from "@/components/common/ProductCard";
import { Badge } from "@/components/ui/badge";
import CompanyRatingsPanel from "@/features/companies/components/store/CompanyRatingsPanel";
import TeamMemberCard from "@/features/companies/components/store/TeamMemberCard";
import { resolveLucideIcon } from "@/features/companies/utils/resolve-lucide-icon";
import { cn } from "@/lib/utils";

const TAB_KEYS = ["store", "about", "services", "coverage", "team", "ratings"];

function CompanyAboutPanel({ about }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 sm:p-6">
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
        {about}
      </p>
    </div>
  );
}

function CompanyServicesPanel({ services }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const Icon = resolveLucideIcon(service.icon);
        return (
          <article
            key={service.id}
            className="rounded-3xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/20"
          >
            <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </div>
            <h3 className="text-base font-semibold">{service.title}</h3>
            {service.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function CompanyCoveragePanel({ areas }) {
  return (
    <div className="flex flex-wrap gap-2">
      {areas.map((area) => (
        <Badge
          key={area.id}
          variant="secondary"
          className="rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary hover:bg-primary/15"
        >
          {area.name}
        </Badge>
      ))}
    </div>
  );
}

function CompanyTeamPanel({ team }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {team.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}

function CompanyStorePanel({ products, locale, emptyTitle, emptyDescription }) {
  if (!products.length) {
    return (
      <EmptyState
        icon={<Package className="size-7 sm:size-8" aria-hidden />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={`${product.source ?? "product"}-${product.id}-${product.sku ?? ""}`}
          product={product}
          locale={locale}
        />
      ))}
    </div>
  );
}

/**
 * Store-first tab navigation. Empty content tabs are hidden (except Store + Ratings).
 */
export default function CompanyStoreTabs({
  company,
  className,
  onRatingSummaryChange,
}) {
  const t = useTranslations("company");
  const locale = useLocale();

  const tabs = useMemo(() => {
    const about = company?.about;
    const services = company?.services ?? [];
    const coverage = company?.coverageAreas ?? [];
    const team = company?.team ?? [];

    return TAB_KEYS.filter((key) => {
      if (key === "store" || key === "ratings") return true;
      if (key === "about") return Boolean(about);
      if (key === "services") return services.length > 0;
      if (key === "coverage") return coverage.length > 0;
      if (key === "team") return team.length > 0;
      return false;
    });
  }, [company]);

  const [active, setActive] = useState("store");
  const current = tabs.includes(active) ? active : "store";

  return (
    <section className={cn("space-y-6", className)}>
      <div
        role="tablist"
        aria-label={t("tabsLabel")}
        className="scrollbar-none flex gap-2 overflow-x-auto pb-1"
      >
        {tabs.map((key) => {
          const isActive = current === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(key)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-accent",
              )}
            >
              {t(`tabs.${key}`)}
            </button>
          );
        })}
      </div>

      <div role="tabpanel">
        {current === "store" && (
          <CompanyStorePanel
            products={company?.products ?? []}
            locale={locale}
            emptyTitle={t("emptyProductsTitle")}
            emptyDescription={t("emptyProducts")}
          />
        )}
        {current === "about" && <CompanyAboutPanel about={company.about} />}
        {current === "services" && (
          <CompanyServicesPanel services={company.services} />
        )}
        {current === "coverage" && (
          <CompanyCoveragePanel areas={company.coverageAreas} />
        )}
        {current === "team" && <CompanyTeamPanel team={company.team} />}
        {current === "ratings" && (
          <CompanyRatingsPanel
            companyId={company.id}
            ratings={company.ratings ?? []}
            myRating={company.myRating}
            averageRating={company.rating}
            ratingsCount={company.reviews ?? 0}
            locale={locale}
            onSummaryChange={onRatingSummaryChange}
          />
        )}
      </div>
    </section>
  );
}
