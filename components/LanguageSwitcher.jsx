"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * @param {{ variant?: "icon" | "labeled"; className?: string }} props
 */
export default function LanguageSwitcher({ variant = "icon", className }) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const nextLocale =
    locale === routing.defaultLocale
      ? routing.locales.find((value) => value !== locale)
      : routing.defaultLocale;

  function switchLocale() {
    if (!nextLocale) return;

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  const label = locale === "en" ? "العربية" : "English";

  if (variant === "labeled") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={switchLocale}
        disabled={isPending}
        className={cn(className)}
        aria-label={t("nav.language")}
      >
        <Globe className="h-4 w-4" />
        {label}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={switchLocale}
      disabled={isPending}
      className={cn(className)}
      aria-label={t("nav.language")}
    >
      <Globe className="h-4.5 w-4.5" />
      <span className="sr-only">{locale}</span>
    </Button>
  );
}
