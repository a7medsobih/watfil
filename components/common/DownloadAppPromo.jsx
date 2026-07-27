"use client";

import { useTranslations } from "next-intl";

import DownloadAppSection from "@/components/common/DownloadAppSection";

/**
 * Localized DownloadAppSection for home / company placements.
 * @param {'home'|'company'} placement
 */
export default function DownloadAppPromo({ placement = "home", className }) {
  const t = useTranslations("downloadApp");
  const key = placement === "company" ? "company" : "home";

  const benefits = [
    t("benefits.track"),
    t("benefits.installation"),
    t("benefits.maintenance"),
    t("benefits.filters"),
    t("benefits.warranty"),
    t("benefits.notifications"),
  ];

  return (
    <DownloadAppSection
      title={t(`${key}.title`)}
      description={t(`${key}.description`)}
      benefits={benefits}
      className={className}
    />
  );
}
