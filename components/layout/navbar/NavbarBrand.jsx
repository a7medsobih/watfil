"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import logo from "@/assets/watfil-logo.png";
import { Link } from "@/i18n/navigation";
import { useCompanyBrand } from "@/features/companies/context/company-brand-context";
import { useExperience } from "@/features/experience";
import { buildCompanyExperienceHref } from "@/features/experience/utils";
import { EXPERIENCE } from "@/features/experience/constants";

export default function NavbarBrand({ hideWatfilFallback = false }) {
  const t = useTranslations();
  const brand = useCompanyBrand();
  const { experience, isCampaign } = useExperience();
  const campaignMode = isCampaign || hideWatfilFallback;

  if (brand?.name) {
    const href = buildCompanyExperienceHref(
      brand.slug,
      campaignMode ? EXPERIENCE.CAMPAIGN : experience,
    );

    return (
      <Link
        href={href}
        className="group flex min-w-0 shrink-0 items-center gap-2"
      >
        {brand.hasLogo && brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.name}
            width={36}
            height={36}
            className="size-8 shrink-0 rounded-lg object-cover sm:size-9 sm:rounded-xl"
          />
        ) : null}
        <span className="max-w-[9rem] truncate text-sm font-bold tracking-tight sm:max-w-[14rem] sm:text-base">
          {brand.name}
        </span>
      </Link>
    );
  }

  // Campaign chrome never falls back to Watfil branding.
  if (campaignMode) {
    return <div className="min-w-0 shrink-0" aria-hidden />;
  }

  return (
    <Link href="/" className="group flex shrink-0 items-center">
      <Image
        src={logo}
        alt={t("brand.name")}
        width={140}
        height={40}
        priority
        className="h-9 w-auto md:h-10"
      />
    </Link>
  );
}
