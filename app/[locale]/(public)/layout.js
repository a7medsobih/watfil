import { Suspense } from "react";

import ExperienceChrome from "@/components/layout/ExperienceChrome";
import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/navbar";
import { CompanyBrandProvider } from "@/features/companies/context/company-brand-context";
import { ExperienceProvider } from "@/features/experience";

function WebsiteFallback({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

/**
 * Public layout — Website shell by default.
 * Campaign shell activates via ?experience=campaign (UI only).
 * Navbar/Footer stay Server Components (passed as slots into the client chrome).
 */
export default function PublicLayout({ children }) {
  return (
    <CompanyBrandProvider>
      <Suspense fallback={<WebsiteFallback>{children}</WebsiteFallback>}>
        <ExperienceProvider>
          <ExperienceChrome
            websiteNavbar={<Navbar />}
            websiteFooter={<Footer />}
          >
            {children}
          </ExperienceChrome>
        </ExperienceProvider>
      </Suspense>
    </CompanyBrandProvider>
  );
}
