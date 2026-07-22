import { getLocale, getTranslations } from "next-intl/server";
import { Building2 } from "lucide-react";

import AppPagination from "@/components/common/AppPagination";
import CampanyCard from "@/components/common/CampanyCard";
import EmptyState from "@/components/common/EmptyState";
import PageHeader from "@/components/common/PageHeader";
import { getCompanies, getGovernorates } from "@/features/companies/api";
import CompaniesSearch from "@/features/companies/components/CompaniesSearch";
import GovernorateTabs from "@/features/companies/components/GovernorateTabs";
import {
  buildCompaniesHref,
  resolveCompaniesParams,
} from "@/features/companies/utils/resolve-companies-params";
import { redirect } from "@/i18n/navigation";

export default async function Page({ searchParams }) {
  const locale = await getLocale();
  const t = await getTranslations();
  const resolvedSearchParams = await searchParams;

  const governorates = await getGovernorates({ locale });
  const defaultGovernorateId = governorates[0]?.id ?? null;

  const hasGovernorateParam = (() => {
    const value = resolvedSearchParams?.governorate;
    const raw = Array.isArray(value) ? value[0] : value;
    return raw != null && raw !== "";
  })();

  if (!hasGovernorateParam && defaultGovernorateId != null) {
    redirect({
      href: buildCompaniesHref({ governorate: defaultGovernorateId }),
      locale,
    });
  }

  const params = resolveCompaniesParams(resolvedSearchParams, {
    defaultGovernorateId,
  });

  const isKnownGovernorate = governorates.some(
    (item) => String(item.id) === String(params.governorate_id),
  );

  const selectedGovernorateId = isKnownGovernorate
    ? params.governorate_id
    : defaultGovernorateId;

  if (
    selectedGovernorateId != null &&
    String(params.governorate_id) !== String(selectedGovernorateId)
  ) {
    redirect({
      href: buildCompaniesHref({
        governorate: selectedGovernorateId,
        page: params.page,
        per_page: params.per_page,
        search: params.search,
      }),
      locale,
    });
  }

  const { companies, meta } = selectedGovernorateId
    ? await getCompanies({
        ...params,
        governorate_id: selectedGovernorateId,
        locale,
      })
    : {
        companies: [],
        meta: { total: 0, currentPage: 1, lastPage: 1, perPage: 15 },
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
          <CompaniesSearch placeholder={t("companies.searchPlaceholder")} />
        }
      />

      <section className="container pb-16 pt-2 sm:pt-4">
        <GovernorateTabs
          governorates={governorates}
          selectedId={selectedGovernorateId}
          ariaLabel={t("companies.governoratesLabel")}
          labels={{
            previous: t("pagination.previous"),
            next: t("pagination.next"),
          }}
        />

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
    </>
  );
}
