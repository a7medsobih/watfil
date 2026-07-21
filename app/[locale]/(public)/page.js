import {
  CategoriesSection,
  HeroSection,
  ProductsSection,
  StatsSection,
  WhySection,
} from "@/features/home";
import CompaniesSection from "@/features/home/components/companies/CompaniesSection";

export default function Page() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ProductsSection />
      {/* <StatsSection /> */}
      <CompaniesSection />
      <WhySection />
    </>
  );
}
