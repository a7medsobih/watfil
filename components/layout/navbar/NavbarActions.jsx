"use client";

import { GitCompare, Heart, History } from "lucide-react";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COMPARE_UI_ENABLED } from "@/features/compare";
import { MiniCartTrigger } from "@/features/cart";
import { Link } from "@/i18n/navigation";
import { useCompareStore, useWishlistCount } from "@/stores";

export default function NavbarActions() {
  const t = useTranslations();
  const compareCount = useCompareStore((state) => state.items.length);
  const wishlistCount = useWishlistCount();

  return (
    <div className="flex items-center gap-1">
      {COMPARE_UI_ENABLED ? (
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="hidden md:inline-flex"
          aria-label={t("nav.compare")}
        >
          <Link href="/compare" className="relative">
            <GitCompare className="h-4.5 w-4.5" />
            {compareCount > 0 ? (
              <Badge className="absolute -end-1 -top-1 h-4 min-w-4 px-1 text-[10px]">
                {compareCount}
              </Badge>
            ) : null}
          </Link>
        </Button>
      ) : null}

      <Button
        variant="ghost"
        size="icon"
        asChild
        aria-label={t("nav.recent")}
      >
        <Link href="/recent">
          <History className="h-4.5 w-4.5" />
        </Link>
      </Button>

      <Button variant="ghost" size="icon" asChild aria-label={t("nav.wishlist")}>
        <Link href="/wishlist" className="relative">
          <Heart className="h-4.5 w-4.5" />
          {wishlistCount > 0 ? (
            <Badge className="absolute -end-1 -top-1 h-4 min-w-4 px-1 text-[10px]">
              {wishlistCount}
            </Badge>
          ) : null}
        </Link>
      </Button>

      <MiniCartTrigger />

      <div className="hidden items-center gap-1 md:flex">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );
}
