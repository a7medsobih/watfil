"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/80 py-1 pe-3 ps-1">
          <Avatar size="sm">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <span className="max-w-[9rem] truncate text-sm font-medium">
            {displayName}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-1.5"
        >
          <LogOutIcon className="size-3.5" />
          {t("auth.actions.logout")}
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
