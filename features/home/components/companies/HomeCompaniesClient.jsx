"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import CampanyCard from "@/components/common/CampanyCard";
import SectionCarousel from "@/components/common/SectionCarousel";
import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTopRatedCompanies } from "@/features/companies/api/get-top-rated-companies";
import { Link } from "@/i18n/navigation";

const ALL_OPTION = "all";
const HOME_COMPANIES_LIMIT = 10;

/**
 * Interactive home companies block: top-rated list + governorate Select.
 */
export default function HomeCompaniesClient({
  initialCompanies = [],
  governorates = [],
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [governorateId, setGovernorateId] = useState(ALL_OPTION);
  const [companies, setCompanies] = useState(initialCompanies);
  const [loading, setLoading] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setCompanies(initialCompanies);
  }, [initialCompanies]);

  const handleGovernorateChange = async (value) => {
    const requestId = ++requestIdRef.current;
    setGovernorateId(value);
    setLoading(true);

    try {
      const result = await getTopRatedCompanies({
        limit: HOME_COMPANIES_LIMIT,
        min_ratings: 1,
        governorate_id: value === ALL_OPTION ? null : value,
        locale,
      });
      if (requestId !== requestIdRef.current) return;
      setCompanies(result.companies ?? []);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
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

      <div className="relative" aria-busy={loading}>
        {loading && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-background/60 backdrop-blur-[1px]"
            aria-hidden
          >
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )}

        {companies.length > 0 ? (
          <SectionCarousel ariaLabel={t("home.companies.title")}>
            {companies.map((company) => (
              <CampanyCard
                key={company.id}
                company={company}
                locale={locale}
                className="h-full"
              />
            ))}
          </SectionCarousel>
        ) : (
          <p className="rounded-3xl border border-border/60 bg-card px-6 py-10 text-center text-sm text-muted-foreground">
            {t("home.companies.empty")}
          </p>
        )}
      </div>
    </section>
  );
}
