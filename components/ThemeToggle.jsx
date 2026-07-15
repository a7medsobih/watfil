"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useThemeToggle } from "@/hooks/useThemeToggle";

/**
 * @param {{ variant?: "icon" | "labeled"; className?: string }} props
 */
export default function ThemeToggle({ variant = "icon", className }) {
  const t = useTranslations();
  const { toggleTheme, isDark, mounted } = useThemeToggle();

  if (variant === "labeled") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={className}
        aria-label={t("nav.theme")}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {mounted ? (isDark ? t("nav.themeLight") : t("nav.themeDark")) : null}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={className}
      aria-label={t("nav.theme")}
    >
      {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
    </Button>
  );
}
