"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import logo from "@/assets/watfil-logo.png";
import { Link } from "@/i18n/navigation";
import { useCompanyBrand } from "@/features/companies/context/company-brand-context";

export default function NavbarBrand() {
  const t = useTranslations();
  const brand = useCompanyBrand();

  if (brand?.name) {
    return (
      <Link
        href={`/companies/${brand.slug}`}
        className="group flex min-w-0 shrink-0 items-center gap-2.5"
      >
        {brand.hasLogo && brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.name}
            width={40}
            height={40}
            className="size-10 rounded-xl object-cover"
          />
        ) : (
          <Image
            src={logo}
            alt={t("brand.name")}
            width={100}
            height={100}
            priority
            className="h-10 w-auto"
          />
        )}
        <span className="max-w-[9rem] truncate text-sm font-bold tracking-tight sm:max-w-[14rem] sm:text-base">
          {brand.name}
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5">
      <Image src={logo} alt={t("brand.name")} width={100} height={100} priority />
    </Link>
  );
}
