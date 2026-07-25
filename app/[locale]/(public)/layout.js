import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/navbar";
import { CompanyBrandProvider } from "@/features/companies/context/company-brand-context";

export default function PublicLayout({ children }) {
  return (
    <CompanyBrandProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </CompanyBrandProvider>
  );
}
