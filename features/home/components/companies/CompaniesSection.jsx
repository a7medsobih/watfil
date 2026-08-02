import { getLocale } from "next-intl/server";

import {
  getGovernorates,
  getTopRatedCompanies,
} from "@/features/companies/api";
import HomeCompaniesClient from "@/features/home/components/companies/HomeCompaniesClient";

const HOME_COMPANIES_PER_PAGE = 8;

export default async function CompaniesSection() {
  const locale = await getLocale();

  const [result, governorates] = await Promise.all([
    getTopRatedCompanies({
      page: 1,
      per_page: HOME_COMPANIES_PER_PAGE,
      min_ratings: 1,
      locale,
    }),
    getGovernorates({ locale }),
  ]);

  const companies = result.companies ?? [];
  const meta = result.meta ?? {
    total: companies.length,
    currentPage: 1,
    lastPage: 1,
    perPage: HOME_COMPANIES_PER_PAGE,
  };

  if (!companies.length && !governorates.length) return null;

  return (
    <HomeCompaniesClient
      initialCompanies={companies}
      initialMeta={meta}
      governorates={governorates}
      perPage={HOME_COMPANIES_PER_PAGE}
    />
  );
}
