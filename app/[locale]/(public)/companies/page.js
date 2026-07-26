import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Building2 } from "lucide-react";

import AppPagination from "@/components/common/AppPagination";
import CampanyCard from "@/components/common/CampanyCard";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import {
  getGovernorates,
  getTopRatedCompanies,
} from "@/features/companies/api";
import CompaniesGovernorateSelect from "@/features/companies/components/CompaniesGovernorateSelect";
import CompaniesSearch from "@/features/companies/components/CompaniesSearch";
import JoinCompanyCTA from "@/features/companies/components/JoinCompanyCTA";
import {
  buildCompaniesHref,
  resolveCompaniesParams,
} from "@/features/companies/utils/resolve-companies-params";

/**
 * Companies directory — top-rated order (same backend as home),
 * optional governorate filter including "all", backend search + pagination.
 */
export default async function Page({ searchParams }) {
  const locale = await getLocale();
  const t = await getTranslations();
  const resolvedSearchParams = await searchParams;

  const governorates = await getGovernorates({ locale });
  const params = resolveCompaniesParams(resolvedSearchParams);

  const isKnownGovernorate =
    params.governorate_id != null &&
    governorates.some(
      (item) => String(item.id) === String(params.governorate_id),
    );

  const selectedGovernorateId = isKnownGovernorate
    ? params.governorate_id
    : null;

  const { companies, meta } = await getTopRatedCompanies({
    page: params.page,
    per_page: params.per_page,
    search: params.search,
    governorate_id: selectedGovernorateId,
    min_ratings: 1,
    locale,
  });

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
          <Suspense fallback={null}>
            <CompaniesSearch placeholder={t("companies.searchPlaceholder")} />
          </Suspense>
        }
      />

      <section className="container pb-8 pt-2 sm:pt-4">
        <div className="mb-6 max-w-sm">
          <Suspense fallback={null}>
            <CompaniesGovernorateSelect
              governorates={governorates}
              selectedId={selectedGovernorateId}
              ariaLabel={t("companies.governoratesLabel")}
              label={t("companies.governoratesLabel")}
              allLabel={t("companies.allGovernorates")}
            />
          </Suspense>
        </div>

        {companies.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {companies.map((company) => (
                <CampanyCard
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
                  governorate: selectedGovernorateId,
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
