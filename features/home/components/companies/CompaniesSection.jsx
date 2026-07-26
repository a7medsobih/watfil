import { getLocale } from "next-intl/server";

import {
  getGovernorates,
  getTopRatedCompanies,
} from "@/features/companies/api";
import HomeCompaniesClient from "@/features/home/components/companies/HomeCompaniesClient";

const HOME_COMPANIES_LIMIT = 10;

export default async function CompaniesSection() {
  const locale = await getLocale();

  const [result, governorates] = await Promise.all([
    getTopRatedCompanies({
      limit: HOME_COMPANIES_LIMIT,
      min_ratings: 1,
      locale,
    }),
    getGovernorates({ locale }),
  ]);

  const companies = result.companies ?? [];

  if (!companies.length && !governorates.length) return null;

  return (
    <HomeCompaniesClient
      initialCompanies={companies}
      governorates={governorates}
    />
  );
}
