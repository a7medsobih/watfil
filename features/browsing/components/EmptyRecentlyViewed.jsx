"use client";

import { History } from "lucide-react";
import { useTranslations } from "next-intl";

import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/**
 * Empty state when the browsing history has no rows.
 */
export default function EmptyRecentlyViewed({
  variant = "products",
  className,
}) {
  const t = useTranslations("browsing");

  const isStores = variant === "stores";

  return (
    <EmptyState
      className={className}
      icon={<History className="size-7 sm:size-8" aria-hidden />}
      title={isStores ? t("empty.storesTitle") : t("empty.productsTitle")}
      description={
        isStores ? t("empty.storesDescription") : t("empty.productsDescription")
      }
      action={
        <Button variant="outline" asChild>
          <Link href={isStores ? "/companies" : "/products"}>
            {isStores ? t("empty.browseCompanies") : t("empty.browseProducts")}
          </Link>
        </Button>
      }
    />
  );
}
