import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function CompaniesSection() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <section className="container py-16">
      <SectionHeader
        eyebrow={locale === "ar" ? "الشركاء" : "Trusted partners"}
        title={t("home.companies.title")}
        subtitle={t("home.companies.subtitle")}
        actions={
          <Button variant="outline" className="text-xs md:text-sm" asChild>
            <Link href="/companies" className="group">
              {t("cta.viewAll")}{" "}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </Button>
        }
      />


      {/* <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {companies.map((company) => (
          <CampanyCard key={company.id} company={company} locale={locale} />
        ))}
      </div> */}
    </section>
  );
}
