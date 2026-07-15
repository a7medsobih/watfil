"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores";

export default function MobileMenu() {
  const t = useTranslations();
  const isOpen = useUiStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useUiStore((state) => state.toggleMobileMenu);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={toggleMobileMenu}
      aria-label={t("nav.menu")}
      aria-expanded={isOpen}
      aria-controls="mobile-nav-drawer"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );
}
