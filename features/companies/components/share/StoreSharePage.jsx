"use client";

import { motion, AnimatePresence } from "motion/react";
import { Loader2, Store } from "lucide-react";
import { useTranslations } from "next-intl";

import MediaImage from "@/components/common/MediaImage";
import DownloadAppSection, {
  WATFIL_PLAY_STORE_URL,
} from "@/components/common/DownloadAppSection";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTryOpenApp } from "@/features/companies/hooks/use-try-open-app";
import { cn } from "@/lib/utils";

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
 * Shows company identity, tries deep_link, then Play Store CTA if still visible.
 */
export default function StoreSharePage({ store }) {
  const t = useTranslations("storeShare");
  const { probing, showStoreCta } = useTryOpenApp(store?.deepLink);

  if (!store) return null;

  const images = store.identityImages ?? [];
  const playStoreUrl = store.playStoreUrl || WATFIL_PLAY_STORE_URL;
  const heroImage = images[0] ?? null;

  return (
    <div className="relative min-h-[70vh] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/12 via-background to-background"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--primary) 22%, transparent) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />

      {heroImage ? (
        <div className="relative h-[42vh] min-h-56 w-full sm:h-[48vh]">
          <MediaImage
            src={heroImage}
            alt={store.name}
            kind="company"
            loading="eager"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-background via-background/55 to-transparent"
            aria-hidden
          />
        </div>
      ) : null}

      <div
        className={cn(
          "relative container pb-16",
          heroImage ? "-mt-16 sm:-mt-20" : "pt-10 md:pt-14",
        )}
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={cn(
              "mx-auto mb-5 flex size-24 items-center justify-center overflow-hidden rounded-3xl border border-border/60 shadow-elegant sm:size-28",
              store.hasLogo ? "bg-card" : "gradient-water",
            )}
          >
            <MediaImage
              src={store.hasLogo ? store.logo : null}
              alt={store.name}
              kind="company"
              loading="eager"
              className="object-contain p-2"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="text-xs font-semibold tracking-[0.18em] text-primary uppercase"
          >
            {t("eyebrow")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="mt-2 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl md:text-[2.6rem] md:leading-tight"
          >
            {store.name}
          </motion.h1>

          {store.about ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              {store.about}
            </motion.p>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              {t("subtitle")}
            </motion.p>
          )}

          <div className="mt-8 min-h-14">
            <AnimatePresence mode="wait">
              {probing ? (
                <motion.div
                  key="probing"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2.5 text-sm text-muted-foreground shadow-soft backdrop-blur-sm"
                >
                  <Loader2 className="size-4 animate-spin text-primary" />
                  {t("openingApp")}
                </motion.div>
              ) : null}

              {showStoreCta ? (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-center gap-3"
                >
                  <p className="text-sm text-muted-foreground">
                    {t("installHint")}
                  </p>
                  <a
                    href={playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-14 min-w-48 items-center gap-3 rounded-xl bg-[#111111] px-5 text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <GooglePlayIcon className="size-7 shrink-0" />
                    <span className="flex min-w-0 flex-col text-start leading-none">
                      <span className="text-[9px] font-medium tracking-wide uppercase opacity-80">
                        {t("getItOn")}
                      </span>
                      <span className="mt-1 text-sm font-semibold tracking-tight">
                        Google Play
                      </span>
                    </span>
                  </a>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {images.length > 1 ? (
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
            {images.slice(1).map((url) => (
              <div
                key={url}
                className="relative aspect-16/10 overflow-hidden rounded-2xl border border-border/50 bg-muted"
              >
                <MediaImage
                  src={url}
                  alt={store.name}
                  kind="company"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : null}

        {showStoreCta ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="mx-auto mt-12 max-w-3xl"
          >
            <DownloadAppSection
              variant="compact"
              title={t("app.title")}
              description={t("app.description")}
              playStoreUrl={playStoreUrl}
            />
          </motion.div>
        ) : null}
      </div>
    </div>
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
      <Button asChild size="lg" className="mt-8">
        <Link href="/">{t("unavailable.home")}</Link>
      </Button>
    </div>
  );
}
