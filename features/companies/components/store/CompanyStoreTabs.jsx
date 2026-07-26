"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Building2, Package } from "lucide-react";

import AppPagination from "@/components/common/AppPagination";
import EmptyState from "@/components/common/EmptyState";
import ProductCard from "@/components/common/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CompanyRatingsPanel from "@/features/companies/components/store/CompanyRatingsPanel";
import TeamMemberCard from "@/features/companies/components/store/TeamMemberCard";
import { resolveLucideIcon } from "@/features/companies/utils/resolve-lucide-icon";
import { cn } from "@/lib/utils";

const TAB_KEYS = [
  "store",
  "about",
  "services",
  "branches",
  "team",
  "ratings",
  "contact",
];

function buildStoreProductsHref(companySlug, page) {
  const base = `/companies/${companySlug}`;
  if (page != null && Number(page) > 1) {
    return `${base}?page=${page}`;
  }
  return base;
}

function subscribeHash(onStoreChange) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function getContactHash() {
  return window.location.hash === "#contact";
}

function getServerContactHash() {
  return false;
}

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

function CompanyBranchesPanel({ areas }) {
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

function CompanyContactPanel({ company, t, onViewStore }) {
  return (
    <div
      id="contact"
      className="rounded-3xl border border-border/60 bg-card p-5 sm:p-8"
    >
      <div className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Building2 className="size-5" aria-hidden />
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{t("contactPanel.title")}</h3>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {t("contactPanel.description")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("contactPanel.noDirectContact")}
          </p>
          {company?.governorate?.name ? (
            <p className="text-sm">
              <span className="text-muted-foreground">
                {t("serviceLocations")}:{" "}
              </span>
              <span className="font-semibold">{company.governorate.name}</span>
            </p>
          ) : null}
          <Button type="button" variant="outline" onClick={onViewStore}>
            {t("contactPanel.viewStore")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CompanyStorePanel({
  products,
  locale,
  companySlug,
  emptyTitle,
  emptyDescription,
  productsMeta,
  paginationLabels,
}) {
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
    <div>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={`${product.source ?? "product"}-${product.id}-${product.sku ?? ""}`}
            product={product}
            locale={locale}
            variant="company"
            companySlug={companySlug}
          />
        ))}
      </div>

      {productsMeta ? (
        <AppPagination
          currentPage={productsMeta.currentPage}
          lastPage={productsMeta.lastPage}
          total={productsMeta.total}
          perPage={productsMeta.perPage}
          labels={paginationLabels}
          hrefBuilder={(page) => buildStoreProductsHref(companySlug, page)}
        />
      ) : null}
    </div>
  );
}

/**
 * Store-first tab navigation. Empty content tabs are hidden (except Store + Ratings + Contact).
 * Store products are paginated via backend GET /public/companies/{id}/products.
 */
export default function CompanyStoreTabs({
  company,
  productsMeta = null,
  paginationLabels = {},
  className,
  onRatingSummaryChange,
}) {
  const t = useTranslations("company");
  const locale = useLocale();

  const tabs = useMemo(() => {
    const about = company?.about;
    const services = company?.services ?? [];
    const branches = company?.coverageAreas ?? [];
    const team = company?.team ?? [];

    return TAB_KEYS.filter((key) => {
      if (key === "store" || key === "ratings" || key === "contact") return true;
      if (key === "about") return Boolean(about);
      if (key === "services") return services.length > 0;
      if (key === "branches") return branches.length > 0;
      if (key === "team") return team.length > 0;
      return false;
    });
  }, [company]);

  const storeProducts = company?.products ?? [];

  const hashWantsContact = useSyncExternalStore(
    subscribeHash,
    getContactHash,
    getServerContactHash,
  );
  const [manualTab, setManualTab] = useState(null);
  const preferred =
    hashWantsContact && tabs.includes("contact") ? "contact" : "store";
  const active = manualTab ?? preferred;
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
              data-company-tab={key}
              aria-selected={isActive}
              onClick={() => setManualTab(key)}
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
            products={storeProducts}
            locale={locale}
            companySlug={company?.slug}
            emptyTitle={t("emptyProductsTitle")}
            emptyDescription={t("emptyProducts")}
            productsMeta={productsMeta}
            paginationLabels={paginationLabels}
          />
        )}
        {current === "about" && <CompanyAboutPanel about={company.about} />}
        {current === "services" && (
          <CompanyServicesPanel services={company.services} />
        )}
        {current === "branches" && (
          <CompanyBranchesPanel areas={company.coverageAreas} />
        )}
        {current === "team" && <CompanyTeamPanel team={company.team} />}
        {current === "ratings" && (
          <CompanyRatingsPanel
            companyId={company.id}
            ratings={company.ratings ?? []}
            myRating={company.myRating}
            averageRating={company.rating}
            ratingsCount={company.reviews ?? 0}
            viewsCount={company.viewsCount ?? 0}
            likesCount={company.likes ?? 0}
            locale={locale}
            onSummaryChange={onRatingSummaryChange}
          />
        )}
        {current === "contact" && (
          <CompanyContactPanel
            company={company}
            t={t}
            onViewStore={() => setManualTab("store")}
          />
        )}
      </div>
    </section>
  );
}
