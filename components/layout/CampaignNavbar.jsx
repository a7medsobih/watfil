"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import NavbarAuth from "@/components/layout/navbar/NavbarAuth";
import NavbarBrand from "@/components/layout/navbar/NavbarBrand";

/**
 * Campaign chrome navbar — company brand only (from CompanyBrandContext).
 * No Watfil logo, no site navigation links.
 */
export default function CampaignNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-b border-border/60">
        <div className="container flex h-16 items-center gap-3 md:h-18">
          <NavbarBrand hideWatfilFallback />
          <div className="flex-1" />
          <LanguageSwitcher />
          <ThemeToggle />
          <NavbarAuth />
        </div>
      </div>
    </header>
  );
}
