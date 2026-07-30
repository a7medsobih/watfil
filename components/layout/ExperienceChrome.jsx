"use client";

import CampaignFooter from "@/components/layout/CampaignFooter";
import CampaignNavbar from "@/components/layout/CampaignNavbar";
import { useExperience } from "@/features/experience";

/**
 * Switches Website vs Campaign chrome.
 * Website Navbar/Footer MUST be Server Component slots from the layout —
 * never import them into this client module.
 */
export default function ExperienceChrome({
  children,
  websiteNavbar,
  websiteFooter,
}) {
  const { isCampaign } = useExperience();

  return (
    <div className={isCampaign ? "flex min-h-dvh flex-col" : undefined}>
      {isCampaign ? <CampaignNavbar /> : websiteNavbar}
      <main className={isCampaign ? "flex-1" : undefined}>{children}</main>
      {isCampaign ? <CampaignFooter /> : websiteFooter}
    </div>
  );
}
