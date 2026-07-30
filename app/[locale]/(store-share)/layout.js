import { Suspense } from "react";

import CampaignFooter from "@/components/layout/CampaignFooter";
import CampaignNavbar from "@/components/layout/CampaignNavbar";
import { CompanyBrandProvider } from "@/features/companies/context/company-brand-context";
import { ExperienceProvider } from "@/features/experience";
import { EXPERIENCE } from "@/features/experience/constants";

/**
 * Campaign shell for /store/{tax}.
 * Same chrome as ?experience=campaign on company routes — no Watfil nav.
 */
export default function StoreShareLayout({ children }) {
  return (
    <CompanyBrandProvider>
      <Suspense
        fallback={
          <div className="flex min-h-dvh flex-col">
            <CampaignNavbar />
            <main className="flex-1">{children}</main>
          </div>
        }
      >
        <ExperienceProvider forceExperience={EXPERIENCE.CAMPAIGN}>
          <div className="flex min-h-dvh flex-col">
            <CampaignNavbar />
            <main className="flex-1">{children}</main>
            <CampaignFooter />
          </div>
        </ExperienceProvider>
      </Suspense>
    </CompanyBrandProvider>
  );
}
