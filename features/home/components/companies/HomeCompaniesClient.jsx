"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import AppPagination from "@/components/common/AppPagination";
import CompanyCard from "@/components/common/CompanyCard";
import LazySectionCarousel from "@/components/common/LazySectionCarousel";
import SectionHeader from "@/components/common/SectionHeader";
import { CompanyCardSkeletonGrid } from "@/components/skeletons/CompanyCardSkeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTopRatedCompanies } from "@/features/companies/api/get-top-rated-companies";
import {
  GOVERNORATE_ALL,
  setGovernoratePreferenceClient,
} from "@/features/governorate";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const ALL_OPTION = "all";
const EMPTY_META = { total: 0, currentPage: 1, lastPage: 1, perPage: 8 };

/**
 * Interactive home companies block: carousel + backend page/per_page pagination.
 * Governorate filter resets to page 1. Carousel stays active on all breakpoints
 * so the homepage scroll height does not grow with more results.
 */
export default function HomeCompaniesClient({
  initialCompanies = [],
  initialMeta = EMPTY_META,
  governorates = [],
  perPage = 8,
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [governorateId, setGovernorateId] = useState(ALL_OPTION);
  const [companies, setCompanies] = useState(initialCompanies);
  const [meta, setMeta] = useState({ ...EMPTY_META, perPage, ...initialMeta });
  const [page, setPage] = useState(initialMeta.currentPage || 1);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setCompanies(initialCompanies);
    setMeta({ ...EMPTY_META, perPage, ...initialMeta });
    setPage(initialMeta.currentPage || 1);
  }, [initialCompanies, initialMeta, perPage]);

  const fetchCompanies = async ({
    nextPage = 1,
    nextGovernorateId = governorateId,
  } = {}) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);

    try {
      const result = await getTopRatedCompanies({
        page: nextPage,
        per_page: perPage,
        min_ratings: 1,
        governorate_id:
          nextGovernorateId === ALL_OPTION ? null : nextGovernorateId,
        locale,
      });
      if (requestId !== requestIdRef.current) return;

      setCompanies(result.companies ?? []);
      setMeta({ ...EMPTY_META, perPage, ...(result.meta ?? {}) });
      setPage(result.meta?.currentPage || nextPage);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const handleGovernorateChange = async (value) => {
    setGovernorateId(value);
    setGovernoratePreferenceClient(
      value === ALL_OPTION ? GOVERNORATE_ALL : value,
    );
    await fetchCompanies({ nextPage: 1, nextGovernorateId: value });
  };

  const handlePageChange = async (nextPage) => {
    if (nextPage === page || loading) return;
    await fetchCompanies({ nextPage, nextGovernorateId: governorateId });
  };

  return (
    <section className="container py-10">
      <SectionHeader
        eyebrow={locale === "ar" ? "الشركاء" : "Trusted partners"}
        title={t("home.companies.title")}
        subtitle={t("home.companies.subtitle")}
        actions={
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            {governorates.length > 0 && (
              <Select
                value={governorateId}
                onValueChange={handleGovernorateChange}
                disabled={loading}
              >
                <SelectTrigger
                  className="w-full sm:w-48"
                  aria-label={t("home.companies.governorate")}
                >
                  <SelectValue
                    placeholder={t("home.companies.allGovernorates")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_OPTION}>
                    {t("home.companies.allGovernorates")}
                  </SelectItem>
                  {governorates.map((governorate) => (
                    <SelectItem
                      key={governorate.id}
                      value={String(governorate.id)}
                    >
                      {governorate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button variant="outline" className="text-xs md:text-sm" asChild>
              <Link href="/companies" className="group">
                {t("cta.viewAll")}{" "}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
            </Button>
          </div>
        }
      />

      <div className="relative" aria-busy={loading || undefined}>
        {loading && companies.length === 0 ? (
          <CompanyCardSkeletonGrid count={Math.min(perPage, 4)} />
        ) : companies.length > 0 ? (
          <div
            className={cn(
              "transition-opacity duration-200",
              loading && "opacity-50",
            )}
          >
            <LazySectionCarousel
              key={`${governorateId}-${page}`}
              keepCarousel
              ariaLabel={t("home.companies.title")}
            >
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  locale={locale}
                  className="h-full"
                />
              ))}
            </LazySectionCarousel>
          </div>
        ) : (
          <p className="rounded-3xl border border-border/60 bg-card px-6 py-10 text-center text-sm text-muted-foreground">
            {t("home.companies.empty")}
          </p>
        )}

        <AppPagination
          currentPage={meta.currentPage || page}
          lastPage={meta.lastPage || 1}
          total={meta.total}
          perPage={meta.perPage || perPage}
          labels={{
            previous: t("pagination.previous"),
            next: t("pagination.next"),
          }}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      </div>
    </section>
  );
}
