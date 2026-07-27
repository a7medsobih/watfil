"use client";

import Image from "next/image";
import {
  Apple,
  Bell,
  Check,
  Droplets,
  Package,
  QrCode,
  Shield,
  Smartphone,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";

import logo from "@/assets/watfil-logo.png";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const WATFIL_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.watfil.client";

/** Set when the iOS listing is published. */
export const WATFIL_APP_STORE_URL = null;

const BENEFIT_ICONS = [Package, Wrench, Droplets, Shield, Bell, Smartphone];

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

function StoreButton({ href, disabled, children, className }) {
  const base =
    "group relative inline-flex h-14 min-w-[10.5rem] items-center gap-3 overflow-hidden rounded-xl px-4 text-start transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  if (disabled || !href) {
    return (
      <span
        className={cn(
          base,
          "cursor-not-allowed border border-dashed border-border/80 bg-muted/60 text-muted-foreground",
          className,
        )}
        aria-disabled
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        base,
        "bg-[#111111] text-white shadow-soft hover:-translate-y-0.5 hover:bg-black hover:shadow-elegant active:translate-y-0",
        className,
      )}
    >
      {children}
    </a>
  );
}

function PhoneMockup({ className }) {
  const t = useTranslations("downloadApp");

  return (
    <div
      className={cn(
        "relative mx-auto w-46 shrink-0 sm:w-50",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -inset-6 rounded-full bg-primary/15 blur-2xl"
        aria-hidden
      />
      <div className="animate-float-slow relative rounded-4xl border border-border/70 bg-foreground p-2 shadow-elegant transition-transform duration-500 hover:-translate-y-1 hover:shadow-glow">
        <div className="relative overflow-hidden rounded-[1.55rem] bg-card">
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-2">
            <span className="h-4 w-20 rounded-full bg-foreground/90" />
          </div>

          <div className="flex min-h-88 flex-col bg-linear-to-b from-primary/15 via-card to-accent/40 px-4 pb-5 pt-10">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-card shadow-soft ring-1 ring-border/60">
              <Image
                src={logo}
                alt=""
                width={40}
                height={40}
                className="h-9 w-auto"
              />
            </div>

            <p className="text-center text-xs font-bold tracking-tight text-foreground">
              {t("badge")}
            </p>
            <p className="mt-1 text-center text-[10px] leading-relaxed text-muted-foreground">
              {t("mockupSubtitle")}
            </p>

            <div className="mt-5 space-y-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/90 px-2.5 py-2 shadow-soft"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="h-2 flex-1 rounded-full bg-muted" />
                </div>
              ))}
            </div>

            <div className="mt-auto pt-5">
              <div className="rounded-xl bg-primary px-3 py-2.5 text-center text-[10px] font-semibold text-primary-foreground shadow-soft">
                {t("mockupCta")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// function QrPlaceholder({ label }) {
//   return (
//     <div className="flex flex-col items-center gap-2">
//       <div
//         className="relative grid size-22 place-items-center overflow-hidden rounded-2xl border border-border/70 bg-card p-2 shadow-soft transition-transform duration-300 hover:-translate-y-0.5"
//         aria-hidden
//       >
//         <div
//           className="absolute inset-0 opacity-[0.35]"
//           style={{
//             backgroundImage:
//               "repeating-linear-gradient(0deg, transparent, transparent 4px, currentColor 4px, currentColor 5px), repeating-linear-gradient(90deg, transparent, transparent 4px, currentColor 4px, currentColor 5px)",
//             color: "var(--foreground)",
//           }}
//         />
//         <div className="relative z-10 grid size-11 place-items-center rounded-lg bg-card text-primary shadow-soft ring-1 ring-border/60">
//           <QrCode className="size-6" />
//         </div>
//       </div>
//       <p className="max-w-22 text-center text-[10px] leading-snug text-muted-foreground">
//         {label}
//       </p>
//     </div>
//   );
// }

/**
 * Reusable app download / continue-in-app section.
 */
export default function DownloadAppSection({
  title,
  description,
  benefits = [],
  playStoreUrl = WATFIL_PLAY_STORE_URL,
  appStoreUrl = WATFIL_APP_STORE_URL,
  className,
  variant = "default",
}) {
  const t = useTranslations("downloadApp");
  const isCompact = variant === "compact";

  return (
    <section
      className={cn(
        "relative overflow-hidden container rounded-3xl border border-border/60",
        isCompact
          ? "bg-card p-5 sm:p-6"
          : "bg-linear-to-br from-primary/12 via-card to-accent-mint/10 p-6 sm:p-8 md:p-10",
        className,
      )}
    >
      {!isCompact ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.45]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--primary) 28%, transparent) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -inset-e-20 -top-20 size-56 rounded-full bg-primary/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -inset-s-16 size-52 rounded-full bg-accent-mint/20 blur-3xl"
            aria-hidden
          />
        </>
      ) : null}

      <div
        className={cn(
          "relative grid items-center",
          isCompact
            ? "gap-5"
            : "gap-8 lg:grid-cols-[minmax(0,1.15fr)_auto] lg:gap-10",
        )}
      >
        <div className="min-w-0">
          <Badge
            variant="secondary"
            className="mb-3 gap-1.5 bg-primary/10 text-primary hover:bg-primary/15"
          >
            <Smartphone className="size-3.5" />
            {t("badge")}
          </Badge>

          <h2 className="text-balance text-xl font-extrabold tracking-tight sm:text-2xl md:text-[1.7rem] md:leading-snug">
            {title}
          </h2>

          {description ? (
            <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}

          {benefits.length > 0 ? (
            <ul
              className={cn(
                "mt-5 grid gap-2.5",
                isCompact
                  ? "sm:grid-cols-2"
                  : "sm:grid-cols-2 xl:grid-cols-3",
              )}
            >
              {benefits.map((benefit, index) => {
                const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length];
                return (
                  <li key={benefit}>
                    <div className="group flex h-full items-start gap-2.5 rounded-2xl border border-border/60 bg-card/80 px-3 py-2.5 shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elegant">
                      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                        <Icon className="size-3.5" />
                      </span>
                      <span className="pt-1 text-sm leading-snug font-medium">
                        {benefit}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <div
            className={cn(
              "mt-6 flex flex-wrap items-end gap-3",
              isCompact ? "" : "sm:gap-4",
            )}
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              {playStoreUrl ? (
                <StoreButton href={playStoreUrl}>
                  <GooglePlayIcon className="size-7 shrink-0" />
                  <span className="flex min-w-0 flex-col leading-none">
                    <span className="text-[9px] font-medium tracking-wide uppercase opacity-80">
                      {t("getItOn")}
                    </span>
                    <span className="mt-1 text-sm font-semibold tracking-tight">
                      Google Play
                    </span>
                  </span>
                </StoreButton>
              ) : null}

              {appStoreUrl ? (
                <StoreButton href={appStoreUrl}>
                  <Apple className="size-7 shrink-0" />
                  <span className="flex min-w-0 flex-col leading-none">
                    <span className="text-[9px] font-medium tracking-wide uppercase opacity-80">
                      {t("downloadOn")}
                    </span>
                    <span className="mt-1 text-sm font-semibold tracking-tight">
                      App Store
                    </span>
                  </span>
                </StoreButton>
              ) : (
                <StoreButton disabled className="relative">
                  <Apple className="size-7 shrink-0 opacity-70" />
                  <span className="flex min-w-0 flex-col leading-none">
                    <span className="text-[9px] font-medium tracking-wide uppercase opacity-70">
                      App Store
                    </span>
                    <span className="mt-1 text-sm font-semibold tracking-tight">
                      {t("comingSoon")}
                    </span>
                  </span>
                </StoreButton>
              )}
            </div>

            {/* {!isCompact ? (
              <div className="hidden md:block">
                <QrPlaceholder label={t("qrHint")} />
              </div>
            ) : null} */}
          </div>
        </div>

        {!isCompact ? (
          <div className="hidden justify-center lg:flex">
            <PhoneMockup />
          </div>
        ) : null}
      </div>
    </section>
  );
}
