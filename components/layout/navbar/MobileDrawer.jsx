"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { LogOutIcon } from "lucide-react";

import logo from "@/assets/watfil-logo.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NavLink from "@/components/common/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WATFIL_PLAY_STORE_URL } from "@/lib/constants/app-store";
import { useAuthDialogStore } from "@/stores/auth-dialog-store";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores";
import { getVisibleNavItems } from "./nav-items";

function getDisplayName(user) {
  if (!user) return "";
  return (
    user.full_name ||
    user.name ||
    user.profile?.full_name ||
    user.phone ||
    ""
  );
}

function getInitials(name) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function MobileDrawer() {
  const t = useTranslations();
  const locale = useLocale();
  const isOpen = useUiStore((state) => state.isMobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);
  const closeMobileMenu = useUiStore((state) => state.closeMobileMenu);
  const openAuthDialog = useAuthDialogStore((state) => state.openAuthDialog);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const items = getVisibleNavItems();
  const side = locale === "ar" ? "left" : "right";
  const isAuthenticated = Boolean(isHydrated && token && user);
  const displayName = getDisplayName(user);
  const avatarUrl = user?.avatar || user?.profile?.avatar || null;

  const openAuth = (intent) => {
    closeMobileMenu();
    openAuthDialog(intent);
  };

  const handleLogout = async () => {
    closeMobileMenu();
    await logout();
    toast.success(t("auth.toast.logout"));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent
        id="mobile-nav-drawer"
        side={side}
        className="md:hidden"
        showCloseButton
      >
        <SheetHeader>
          <SheetTitle className="sr-only">{t("brand.name")}</SheetTitle>
          <Image
            src={logo}
            alt={t("brand.name")}
            width={120}
            height={34}
            className="h-8 w-auto"
          />
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

        <div className="mt-2 flex flex-col gap-2 px-2">
          {isAuthenticated ? (
            <>
              <div className="rounded-2xl border border-border/60 bg-card/80 p-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={displayName} />
                    ) : null}
                    <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{displayName}</p>
                    {user?.phone ? (
                      <p dir="ltr" className="truncate text-xs text-muted-foreground">
                        {user.phone}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-border/50 bg-background/80 p-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-border/60">
                    <img
                      src="/favicon.ico"
                      alt=""
                      width={24}
                      height={24}
                      className="size-6 object-contain"
                    />
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {t("downloadApp.home.description")}
                  </p>
                </div>
                <a
                  href={WATFIL_PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="mt-3 inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#111111] px-3 text-xs font-medium text-white transition-colors hover:bg-black"
                >
                  {t("footer.appCta")}
                </a>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full gap-1.5 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOutIcon className="size-3.5 rtl:rotate-180" />
                {t("auth.actions.logout")}
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => openAuth("login")}
              >
                {t("nav.login")}
              </Button>
              <Button
                variant="hero"
                size="sm"
                className="flex-1"
                onClick={() => openAuth("register")}
              >
                {t("nav.register")}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
