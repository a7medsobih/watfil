"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { LogOutIcon } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";

import logo from "@/assets/watfil-logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WATFIL_PLAY_STORE_URL } from "@/lib/constants/app-store";
import { cn } from "@/lib/utils";
import { useAuthDialogStore } from "@/stores/auth-dialog-store";
import { useAuthStore } from "@/stores/auth-store";

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

function GooglePlayIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M3.6 20.7c.3.4.8.6 1.3.5l12-6.9-2.9-2.9-10.4 9.3z"
      />
      <path
        fill="#FBBC04"
        d="M16.9 7.7 4.9 2.8c-.5-.2-1 0-1.3.5L13.9 12l3-4.3z"
      />
      <path
        fill="#4285F4"
        d="m21.2 10.7-3.3-1.9-3.2 3.2 3.2 3.2 3.3-1.9c.9-.5.9-1.9 0-2.6z"
      />
      <path
        fill="#34A853"
        d="M3.6 3.3c-.3.2-.5.6-.5 1.1v15.2c0 .5.2.9.5 1.1L14 12 3.6 3.3z"
      />
    </svg>
  );
}

export default function NavbarAuth() {
  const t = useTranslations();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const openAuthDialog = useAuthDialogStore((state) => state.openAuthDialog);

  const isAuthenticated = Boolean(isHydrated && token && user);
  const displayName = getDisplayName(user);
  const avatarUrl = user?.avatar || user?.profile?.avatar || null;

  const handleLogout = async () => {
    await logout();
    toast.success(t("auth.toast.logout"));
  };

  if (!isHydrated) {
    return (
      <div className="ms-2 hidden h-7 w-40 items-center md:flex" aria-hidden />
    );
  }

  if (isAuthenticated) {
    return (
      <div className="ms-2 hidden items-center gap-2 md:flex">
        <PopoverPrimitive.Root>
          <PopoverPrimitive.Trigger asChild>
            <button
              type="button"
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-full border border-border/60 bg-card/80 py-1 pe-3 ps-1",
                "transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              )}
              aria-label={t("nav.continueInApp")}
            >
              <Avatar size="sm">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={displayName} />
                ) : null}
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <span className="max-w-36 truncate text-sm font-medium">
                {displayName}
              </span>
            </button>
          </PopoverPrimitive.Trigger>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="end"
              sideOffset={8}
              className={cn(
                "z-50 w-72 rounded-2xl border border-border/60 bg-popover p-4 text-popover-foreground shadow-elegant outline-none",
                "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
                "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
              )}
            >
              <div className="flex gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background ring-1 ring-border/60">
                  <img
                    src="/favicon.ico"
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <Image
                    src={logo}
                    alt={t("brand.name")}
                    width={100}
                    height={28}
                    className="mb-1.5 h-5 w-auto"
                  />
                  <p className="text-sm font-semibold leading-snug">
                    {t("downloadApp.home.title")}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t("downloadApp.home.description")}
                  </p>
                </div>
              </div>

              <a
                href={WATFIL_PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#111111] px-3 text-sm font-medium text-white transition-colors hover:bg-black"
              >
                <GooglePlayIcon className="size-5" />
                <span>{t("downloadApp.getItOn")} Google Play</span>
              </a>

              <PopoverPrimitive.Arrow className="fill-popover" />
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          {t("auth.actions.logout")}
          <LogOutIcon className="size-3.5 rtl:rotate-180" />
        </Button>
      </div>
    );
  }

  return (
    <div className="ms-2 hidden items-center gap-2 md:flex">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => openAuthDialog("login")}
      >
        {t("nav.login")}
      </Button>
      <Button
        variant="hero"
        size="sm"
        onClick={() => openAuthDialog("register")}
      >
        {t("nav.register")}
      </Button>
    </div>
  );
}
