// src/features/companies/components/share/StoreSharePage.jsx
"use client";

import { motion } from "motion/react";
import {
  Bell,
  ExternalLink,
  Package,
  Shield,
  Smartphone,
  Store,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";

import MediaImage from "@/components/common/MediaImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import StoreShareHero from "@/features/companies/components/share/StoreShareHero";
import { CompanyBrandSetter } from "@/features/companies/context/company-brand-context";
import { useTryOpenApp } from "@/features/companies/hooks/use-try-open-app";
import { EXPERIENCE } from "@/features/experience/constants";
import { buildCompanyExperienceHref } from "@/features/experience/utils";
import { WATFIL_PLAY_STORE_URL } from "@/lib/constants/app-store";
import { cn } from "@/lib/utils";

const CTA_BENEFITS = [
  { key: "track", Icon: Package },
  { key: "installation", Icon: Wrench },
  { key: "warranty", Icon: Shield },
  { key: "notifications", Icon: Bell },
];

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

/**
 * Public share landing for /store/{tax_number}.
 * Goal: introduce the company, then open / download the Watfil app.
 */
export default function StoreSharePage({ store }) {
  const t = useTranslations("storeShare");
  const tApp = useTranslations("downloadApp");
  const { probing } = useTryOpenApp(store?.deepLink);

  if (!store) return null;

  const playStoreUrl = store.playStoreUrl || WATFIL_PLAY_STORE_URL;
  const companyKey = store.companySlug || store.companyId;
  const companyHref = companyKey
    ? buildCompanyExperienceHref(companyKey, EXPERIENCE.CAMPAIGN)
    : null;

  const brand = {
    slug: String(companyKey || store.taxNumber || ""),
    name: store.name,
    logo: store.logo,
    hasLogo: store.hasLogo,
  };

  const openApp = () => {
    if (!store.deepLink) return;
    window.location.href = store.deepLink;
  };

  return (
    <>
      <CompanyBrandSetter brand={brand} />
      <div className="pb-10 md:pb-16">
        <StoreShareHero
          images={store.identityImages}
          companyName={store.name}
        />

        <div className="relative z-10 container -mt-12 sm:-mt-14 md:-mt-16">
          <div className="mx-auto space-y-10 sm:space-y-12">
            {/* Compact company identity card */}
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mx-auto w-full max-w-sm rounded-2xl border border-border/60 bg-card/95 px-5 py-5 shadow-soft backdrop-blur-md sm:px-6 sm:py-6"
            >
              <div className="flex flex-col items-center text-center">
                {companyHref ? (
                  <Link
                    href={companyHref}
                    className={cn(
                      "flex size-14 items-center justify-center overflow-hidden rounded-xl border border-border/60 shadow-soft transition-transform hover:scale-[1.02] sm:size-16",
                      store.hasLogo ? "bg-card" : "gradient-water",
                    )}
                    aria-label={store.name}
                  >
                    <MediaImage
                      src={store.hasLogo ? store.logo : null}
                      alt={store.name}
                      kind="company"
                      loading="eager"
                      className="object-contain p-1.5"
                    />
                  </Link>
                ) : (
                  <div
                    className={cn(
                      "flex size-14 items-center justify-center overflow-hidden rounded-xl border border-border/60 shadow-soft sm:size-16",
                      store.hasLogo ? "bg-card" : "gradient-water",
                    )}
                  >
                    <MediaImage
                      src={store.hasLogo ? store.logo : null}
                      alt={store.name}
                      kind="company"
                      loading="eager"
                      className="object-contain p-1.5"
                    />
                  </div>
                )}

                <h1 className="mt-3 text-balance text-lg font-bold tracking-tight sm:text-xl">
                  {companyHref ? (
                    <Link
                      href={companyHref}
                      className="transition-colors hover:text-primary"
                    >
                      {store.name}
                    </Link>
                  ) : (
                    store.name
                  )}
                </h1>

                {store.taxNumber ? (
                  <p className="mt-1.5 text-[11px] font-medium tracking-wide text-muted-foreground tabular-nums sm:text-xs">
                    {t("taxNumber")}: {store.taxNumber}
                  </p>
                ) : null}
              </div>
            </motion.section>

            {/* About — open typography, no card */}
            {store.about ? (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, duration: 0.4, ease: "easeOut" }}
                className="mx-auto max-w-4xl px-1 text-center sm:px-2"
              >
                <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {t("aboutTitle")}
                </h2>
                <p className="mt-4 text-pretty text-sm leading-7 text-muted-foreground sm:text-[0.95rem] sm:leading-8">
                  {store.about}
                </p>
              </motion.section>
            ) : null}

            {/* App CTA — inspired by DownloadAppSection */}
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-primary/12 via-card to-accent-mint/10 p-6 shadow-soft sm:p-8 md:p-10"
            >
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

              <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_auto] lg:gap-10">
                <div className="min-w-0 text-center lg:text-start">
                  <Badge
                    variant="secondary"
                    className="mb-3 gap-1.5 bg-primary/10 text-primary hover:bg-primary/15"
                  >
                    <img
                      src="/favicon.ico"
                      alt=""
                      width={14}
                      height={14}
                      className="size-3.5 object-contain"
                    />
                    {tApp("badge")}
                  </Badge>

                  <h2 className="text-balance text-xl font-extrabold tracking-tight sm:text-2xl md:text-[1.7rem] md:leading-snug">
                    {t("cta.title")}
                  </h2>

                  <p className="mx-auto mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base lg:mx-0">
                    {probing ? t("openingApp") : t("cta.description")}
                  </p>



                  <div className="mt-6 flex flex-col gap-3">
                    {/* Primary */}
                    <Button
                      type="button"
                      variant="hero"
                      size="lg"
                      disabled={!store.deepLink || probing}
                      onClick={openApp}
                      className="h-14 w-full rounded-xl text-base font-semibold shadow-elegant transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <Smartphone className="size-5" aria-hidden />
                      {probing ? t("openingApp") : t("openInApp")}
                    </Button>

                    {/* Secondary + Outline */}
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <a
                        href={playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#111111] px-4 text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0"
                      >
                        <GooglePlayIcon className="size-7 shrink-0" />
                        <span className="flex min-w-0 flex-col text-start leading-none">
                          <span className="text-[9px] font-medium tracking-wide uppercase opacity-80">
                            {tApp("getItOn")}
                          </span>
                          <span className="mt-1 text-sm font-semibold tracking-tight">
                            Google Play
                          </span>
                        </span>
                      </a>

                      {companyHref ? (
                        <Button
                          asChild
                          variant="outline"
                          size="lg"
                          className="h-14 w-full rounded-xl border-border/70 bg-card/80 text-sm font-medium backdrop-blur-sm hover:bg-card"
                        >
                          <Link href={companyHref}>
                            <ExternalLink className="size-4" aria-hidden />
                            {t("viewStore")}
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Decorative phone cue — same visual family as DownloadAppSection */}
                <div className="relative mx-auto hidden w-44 shrink-0 lg:block">
                  <div
                    className="pointer-events-none absolute -inset-6 rounded-full bg-primary/15 blur-2xl"
                    aria-hidden
                  />
                  <div className="animate-float-slow relative rounded-4xl border border-border/70 bg-foreground p-2 shadow-elegant">
                    <div className="relative overflow-hidden rounded-[1.55rem] bg-card">
                      <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-2">
                        <span className="h-4 w-20 rounded-full bg-foreground/90" />
                      </div>
                      <div className="flex min-h-72 flex-col bg-linear-to-b from-primary/15 via-card to-accent/40 px-4 pb-5 pt-10">
                        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-card shadow-soft ring-1 ring-border/60">
                          <Smartphone className="size-5 text-primary" />
                        </div>
                        <p className="text-center text-xs font-bold tracking-tight">
                          {tApp("badge")}
                        </p>
                        <p className="mt-1 text-center text-[10px] leading-relaxed text-muted-foreground">
                          {tApp("mockupSubtitle")}
                        </p>
                        <div className="mt-auto pt-5">
                          <div className="rounded-xl bg-primary px-3 py-2.5 text-center text-[10px] font-semibold text-primary-foreground shadow-soft">
                            {t("openInApp")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div >
    </>
  );
}

export function StoreShareNotAvailable() {
  const t = useTranslations("storeShare");

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Store className="size-8" strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
        {t("unavailable.title")}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        {t("unavailable.description")}
      </p>
    </div>
  );
}
