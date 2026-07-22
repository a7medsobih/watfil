"use client";

import { GitCompare, Heart, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useCompareStore, useWishlistCountStore } from "@/stores";

export default function NavbarActions() {
  const t = useTranslations();
  const compareCount = useCompareStore((state) => state.items.length);
  const wishlistCount = useWishlistCountStore((state) => state.count);

  return (
    <div className="hidden items-center gap-1 md:flex">
      <Button variant="ghost" size="icon" asChild aria-label={t("nav.search")}>
        <Link href="/search">
          <Search className="h-4.5 w-4.5" />
        </Link>
      </Button>

      <Button variant="ghost" size="icon" asChild aria-label={t("nav.compare")}>
        <Link href="/compare" className="relative">
          <GitCompare className="h-4.5 w-4.5" />
          {compareCount > 0 ? (
            <Badge className="absolute -end-1 -top-1 h-4 min-w-4 px-1 text-[10px]">
              {compareCount}
            </Badge>
          ) : null}
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

      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}
