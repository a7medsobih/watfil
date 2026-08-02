// src/app/[locale]/(public)/companies/page.js
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Building2 } from "lucide-react";

import AppPagination from "@/components/common/AppPagination";
import CompanyCard from "@/components/common/CompanyCard";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCompanies,
  getGovernorates,
} from "@/features/companies/api";
import CompaniesGovernorateSelect from "@/features/companies/components/CompaniesGovernorateSelect";
import CompaniesSearch from "@/features/companies/components/CompaniesSearch";
import JoinCompanyCTA from "@/features/companies/components/JoinCompanyCTA";
import {
  buildCompaniesHref,
  resolveCompaniesParams,
} from "@/features/companies/utils/resolve-companies-params";
import {
  getGovernoratePreferenceFromCookies,
  needsGovernorateUrlSeed,
  pickGovernorateId,
} from "@/features/governorate";
import { redirect as i18nRedirect } from "@/i18n/navigation";

/**
 * Companies directory using public companies listing endpoint
 * with governorate + search + pagination filters.
 *
 * Missing governorate_id is seeded in proxy.ts before this page runs.
 * This redirect is only a safety net for unknown/invalid ids.
 */
export default async function Page({ searchParams }) {
  const locale = await getLocale();
  const t = await getTranslations();
  const resolvedSearchParams = await searchParams;

  const [governorates, preferredId] = await Promise.all([
    getGovernorates({ locale }),
    getGovernoratePreferenceFromCookies(),
  ]);
  const params = resolveCompaniesParams(resolvedSearchParams);

  const selectedGovernorateId = pickGovernorateId({
    rawId: params.governorate_id,
    governorates,
    preferredId,
    allowAll: false,
  });

  if (
    needsGovernorateUrlSeed({
      rawId: params.governorate_id,
      selectedId: selectedGovernorateId,
      allowAll: false,
    })
  ) {
    i18nRedirect({
      href: buildCompaniesHref({
        governorate_id: selectedGovernorateId,
        page: params.page,
        per_page: params.per_page,
        search: params.search,
      }),
      locale,
    });
  }

  const { companies, meta } =
    selectedGovernorateId != null
      ? await getCompanies({
          page: params.page,
          per_page: params.per_page,
          search: params.search,
          governorate_id: selectedGovernorateId,
          locale,
        })
      : {
          companies: [],
          meta: {
            total: 0,
            currentPage: 1,
            lastPage: 1,
            perPage: Number(params.per_page ?? 15) || 15,
          },
        };

  return (
    <>
      <PageHeader
        title={t("companies.title")}
        subtitle={t("companies.count", { count: meta.total })}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.companies") },
        ]}
        actions={
          <Suspense fallback={<Skeleton className="h-11 w-full max-w-md rounded-full" />}>
            <CompaniesSearch placeholder={t("companies.searchPlaceholder")} />
          </Suspense>
        }
      />

      <section className="container pb-8 pt-2 sm:pt-4">
        <div className="mb-6 max-w-sm">
          <Suspense fallback={<Skeleton className="h-11 w-full rounded-xl" />}>
            <CompaniesGovernorateSelect
              governorates={governorates}
              selectedId={selectedGovernorateId}
              ariaLabel={t("companies.governoratesLabel")}
              label={t("companies.governoratesLabel")}
              allLabel={t("companies.allGovernorates")}
              allowAll={false}
            />
          </Suspense>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("companies.governorateHint")}
          </p>
        </div>

        {companies.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  locale={locale}
                />
              ))}
            </div>

            <AppPagination
              currentPage={meta.currentPage}
              lastPage={meta.lastPage}
              total={meta.total}
              perPage={meta.perPage}
              labels={{
                previous: t("pagination.previous"),
                next: t("pagination.next"),
              }}
              hrefBuilder={(page) =>
                buildCompaniesHref({
                  governorate_id: selectedGovernorateId,
                  page,
                  per_page: params.per_page,
                  search: params.search,
                })
              }
            />
          </>
        ) : (
          <EmptyState
            icon={<Building2 className="size-7 sm:size-8" aria-hidden />}
            title={t("companies.emptyTitle")}
            description={t("companies.empty")}
          />
        )}
      </section>

      <JoinCompanyCTA
        className="pb-16 pt-2"
        title={t("joinUs.cta.companies.title")}
        description={t("joinUs.cta.companies.description")}
        actionLabel={t("joinUs.actions.joinNow")}
      />
    </>
  );
}
