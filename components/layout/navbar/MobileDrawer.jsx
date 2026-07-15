"use client";

import { useLocale, useTranslations } from "next-intl";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import NavLink from "@/components/common/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { useUiStore } from "@/stores";
import { getVisibleNavItems } from "./nav-items";

export default function MobileDrawer() {
  const t = useTranslations();
  const locale = useLocale();
  const isOpen = useUiStore((state) => state.isMobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);
  const closeMobileMenu = useUiStore((state) => state.closeMobileMenu);
  const items = getVisibleNavItems();
  const side = locale === "ar" ? "left" : "right";

  return (
    <Sheet open={isOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent
        id="mobile-nav-drawer"
        side={side}
        className="md:hidden"
        showCloseButton
      >
        <SheetHeader>
          <SheetTitle>{t("brand.name")}</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-2" aria-label={t("nav.primary")}>
          {items.map((item) => (
            <NavLink
              key={item.key}
              href={item.href}
              showIndicator={false}
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-accent"
              activeClassName="bg-accent text-primary"
              inactiveClassName="text-foreground"
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="mt-3 flex flex-wrap gap-2 px-2">
          <LanguageSwitcher variant="labeled" />
          <ThemeToggle variant="labeled" />
        </div>

        <div className="mt-2 flex gap-2 px-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href="/login" onClick={closeMobileMenu}>
              {t("nav.login")}
            </Link>
          </Button>
          <Button variant="hero" size="sm" asChild className="flex-1">
            <Link href="/register" onClick={closeMobileMenu}>
              {t("nav.register")}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
